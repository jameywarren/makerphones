// Interactive parts viewer for the Daily Driver — explode/collapse, sub-assembly
// toggles, and click-to-isolate. Loads the SINGLE published assembly GLB + the
// sub-assembly manifest cross-origin from the daily-driver repo's GitHub Pages
// (nothing copied on-site). Per-part nodes are named (cup_R, baffle_L, …); the
// manifest groups them. Explode is computed at runtime from part centroids — no
// baked animation, no per-part GLBs.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const K_LOCAL = 2.8;   // separation of parts WITHIN a sub-assembly at full explode
const K_GROUP = 1.1;   // separation of sub-assemblies from each other

export function initPartsViewer(root) {
  const canvas = root.querySelector('[data-pv-canvas]');
  if (!canvas || root.dataset.pvReady) return;
  root.dataset.pvReady = '1';
  const glbUrl = root.dataset.glb;
  const groupsUrl = root.dataset.groups;
  const explodeEl = root.querySelector('[data-pv-explode]');
  const groupsEl = root.querySelector('[data-pv-groups]');
  const resetEl = root.querySelector('[data-pv-reset]');
  const statusEl = root.querySelector('[data-pv-status]');
  const fsEl = root.querySelector('[data-pv-fullscreen]');
  const setStatus = (t) => { if (statusEl) statusEl.textContent = t; };

  // Fullscreen toggle — wired up-front (independent of the WebGL lazy-start). The
  // canvas re-sizes via its ResizeObserver when the stage grows/shrinks.
  if (fsEl) {
    fsEl.addEventListener('click', () => {
      if (document.fullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      else (root.requestFullscreen || root.webkitRequestFullscreen)?.call(root);
    });
    document.addEventListener('fullscreenchange', () => {
      fsEl.textContent = document.fullscreenElement === root ? '✕ Exit fullscreen' : '⤢ Fullscreen';
    });
  }

  // Lazy: don't spin up WebGL until the viewer scrolls near the viewport.
  let started = false;
  const io = new IntersectionObserver((entries) => {
    if (!started && entries.some((e) => e.isIntersecting)) {
      started = true;
      io.disconnect();
      start().catch((err) => { console.error('[parts-viewer]', err); setStatus('Could not load the 3D model. Try a hard refresh.'); });
    }
  }, { rootMargin: '300px' });
  io.observe(root);

  async function start() {
    setStatus('Loading 3D model…');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100000);
    // Image-based lighting (a neutral room) so PBR parts read evenly and BRIGHT —
    // the bare directional lights here looked darker than the model-viewer preview,
    // which lifts the model with a default environment. This matches that.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x40424a, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(1, 1.4, 1.2); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7); fill.position.set(-1.2, 0.5, -1.0); scene.add(fill);

    // On-demand render (throttled to one per animation frame). Defined BEFORE the
    // controls listener so the first controls.update()'s 'change' can call it safely.
    let pending = false;
    function requestRender() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; renderer.render(scene, camera); });
    }

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;            // render only on input → 0% idle CPU
    controls.addEventListener('change', requestRender);

    const [groupsData, gltf] = await Promise.all([
      fetch(groupsUrl).then((r) => r.json()).catch(() => ({ groups: [], bought: [] })),
      new GLTFLoader().loadAsync(glbUrl),
    ]);
    scene.add(gltf.scene);
    gltf.scene.updateWorldMatrix(true, true);

    // Collect WHOLE-PART nodes by name — NOT the leaf face-meshes. OCCT exports one
    // glTF primitive per B-rep face, which GLTFLoader splits into many sub-meshes;
    // exploding those individually would fragment a part into its faces. Each part
    // node (a Group of face-meshes) moves/hides as one rigid body. Reparent to the
    // scene root so the local frame == world (no glTF Y-up skew on the explode math).
    const names = (groupsData.groups || []).flatMap((g) => g.nodes);
    let parts = [];
    for (const n of names) { const o = gltf.scene.getObjectByName(n); if (o && !parts.includes(o)) parts.push(o); }
    if (!parts.length) {  // fallback: the named children of the assembly root
      const root = gltf.scene.getObjectByName('daily_driver') || gltf.scene;
      parts = root.children.filter((c) => c.name);
    }
    for (const p of parts) scene.attach(p);

    const byName = new Map(parts.map((p) => [p.name, p]));
    const nodeGroup = new Map();
    for (const g of groupsData.groups || []) for (const n of g.nodes) nodeGroup.set(n, g.id);

    // Reference-context parts (the translucent worn-fit HEAD): shown OFF by default, held OUT of the
    // explode, made translucent, and excluded from the fit so the giant head never blows up framing.
    const refContext = new Set(groupsData.reference_context || []);
    const isContext = (p) => refContext.has(p.name);
    for (const p of parts) if (isContext(p)) {
      p.traverse((o) => {
        if (o.isMesh && o.material) {
          o.material = o.material.clone();
          o.material.transparent = true; o.material.opacity = 0.25;
          o.material.depthWrite = false; o.material.side = THREE.DoubleSide;
        }
      });
    }
    // Box of just the REAL parts (no context head, only visible) — drives centring + framing.
    const worldBox = (o) => new THREE.Box3().setFromObject(o);
    const fitBox = () => {
      const b = new THREE.Box3();
      for (const p of parts) if (!isContext(p) && p.visible) b.expandByObject(p);
      return b;
    };

    // Centers: whole model + per sub-assembly (world space).
    const center = fitBox().getCenter(new THREE.Vector3());
    const gBox = new Map();
    for (const p of parts) {
      const gid = nodeGroup.get(p.name) || '_';
      if (!gBox.has(gid)) gBox.set(gid, new THREE.Box3().makeEmpty());
      gBox.get(gid).expandByObject(p);
    }
    const gCenter = new Map([...gBox].map(([gid, b]) => [gid, b.getCenter(new THREE.Vector3())]));

    // Per-part rest + explode offset: separate within the group, then push groups apart.
    for (const p of parts) {
      const gc = gCenter.get(nodeGroup.get(p.name) || '_') || center;
      const pc = worldBox(p).getCenter(new THREE.Vector3());
      const off = pc.clone().sub(gc).multiplyScalar(K_LOCAL)
        .add(gc.clone().sub(center).multiplyScalar(K_GROUP));
      p.userData.rest = p.position.clone();
      p.userData.off = isContext(p) ? new THREE.Vector3() : off;   // the reference head stays put
    }

    // AUTO-FIT: when a single reference head is toggled on, shift the HEADBAND group along the
    // model's vertical so the band lands on THAT head (cups stay → the width/clamp still reads).
    // Offsets (mm, model +z) come from the manifest; the up-axis is derived from the bow so it
    // survives the glTF Y-up import. Defensive: absent data → no-op.
    const headFit = groupsData.head_fit || null;
    const bandSet = new Set((headFit && headFit.band_nodes) || []);
    const fitUp = (() => {
      const bow = byName.get('bow_ref');
      if (!bow) return new THREE.Vector3(0, 1, 0);
      const v = worldBox(bow).getCenter(new THREE.Vector3()).sub(center);
      return v.lengthSq() > 1e-6 ? v.normalize() : new THREE.Vector3(0, 1, 0);
    })();
    for (const p of parts) if (bandSet.has(p.name)) p.userData.rest0 = p.userData.rest.clone();

    // Frame the camera (on the real parts — not the big context head).
    const sph = fitBox().getBoundingSphere(new THREE.Sphere());
    const dist = (sph.radius / Math.sin((camera.fov * Math.PI) / 180 / 2)) * 1.2;
    camera.position.copy(sph.center).add(new THREE.Vector3(0.85, 0.5, 1).normalize().multiplyScalar(dist));
    camera.near = dist / 100; camera.far = dist * 10; camera.updateProjectionMatrix();
    controls.target.copy(sph.center); controls.update();

    // Explode slider.
    const applyExplode = (t) => {
      for (const p of parts) p.position.copy(p.userData.rest).addScaledVector(p.userData.off, t);
      requestRender();
    };
    explodeEl?.addEventListener('input', () => applyExplode(parseFloat(explodeEl.value) || 0));

    // Visibility = per-part-TYPE toggles × a SIDE filter (both / one earcup). Re-frames
    // the camera to whatever's visible so a single earcup fills the view (no zooming
    // past the other ear). Part names: cup_R, driver_clamp_L, insert_p_R, bow_ref, …
    const typeOf = (n) => n.replace(/_(R|L)$/, '').replace(/_(p|m)$/, '').replace(/_ref$/, '');
    const HW = new Set(['insert', 'screw']);
    const typeKey = (n) => {
      const h = /^head_ref_(s|m|l)$/.exec(n);   // S/M/L reference heads → three separate toggles
      if (h) return 'head_' + h[1];
      const t = typeOf(n); return HW.has(t) ? 'hardware' : t;
    };
    const sideOf = (n) => (/_R$/.test(n) ? 'R' : /_L$/.test(n) ? 'L' : 'both');
    const TYPE_LABEL = {
      cup: 'Cup', baffle: 'Baffle', driver: 'Driver', driver_clamp: 'Driver clamp',
      yoke: 'Yoke', slider: 'Slider', bow: 'Bow', headband_pad: 'Headband pad', hardware: 'Hardware',
      slider_shoe: 'Pressure shoe', yoke_rod: 'Adjustment rod', thumbscrew: 'Thumbscrew',
      headband_clamp: 'Band clamp', earpad: 'Ear pads',
      damping: 'Damping felt', gasket: 'Front gasket', head: 'Reference head',
    };
    const types = [];
    for (const p of parts) { const k = typeKey(p.name); if (!types.includes(k)) types.push(k); }
    const contextTypes = new Set([...refContext].map((n) => typeKey(n)));  // reference-only types (the head)
    const typeOn = new Map(types.map((t) => [t, !contextTypes.has(t)]));    // context types start OFF
    let sideFilter = 'both';
    let isolated = null;
    let shadow = null;   // contact-shadow plane; follows the VISIBLE bottom (see placeShadow)

    // Re-pose the headband for the toggled head. Active only when EXACTLY ONE head is on (so a
    // single-head view fits that head; none / multiple → the neutral M pose).
    let fitDz = 0;
    function applyHeadFit() {
      if (!headFit || !headFit.dz) return;
      const on = ['s', 'm', 'l'].filter((k) => typeOn.get('head_' + k));
      const dz = on.length === 1 ? (headFit.dz[on[0]] || 0) : 0;
      if (dz === fitDz) return;
      fitDz = dz;
      for (const p of parts) if (bandSet.has(p.name) && p.userData.rest0) {
        p.userData.rest.copy(p.userData.rest0).addScaledVector(fitUp, dz);
      }
      applyExplode(parseFloat(explodeEl?.value) || 0);   // recompose with the current explode
    }

    function applyVisibility() {
      isolated = null;
      for (const p of parts) {
        const okType = typeOn.get(typeKey(p.name)) !== false;
        const s = sideOf(p.name);
        const okSide = sideFilter === 'both' ? true : s === sideFilter;  // one earcup hides the other side + the shared headband
        p.visible = okType && okSide;
      }
      placeShadow();
      requestRender();
    }

    // Park the contact shadow at the bottom of the VISIBLE model: at the earcups with the head off,
    // and at the head's neck-bottom (just below the chin) when the reference head is toggled on — so
    // the ground never chops through the head.
    function placeShadow() {
      if (!shadow) return;
      const b = new THREE.Box3();
      let any = false;
      for (const p of parts) if (p.visible) { b.expandByObject(p); any = true; }
      if (!any) return;
      const c = b.getCenter(new THREE.Vector3());
      const sz = b.getSize(new THREE.Vector3());
      shadow.position.set(c.x, b.min.y - sz.y * 0.015, c.z);
    }

    function frameVisible() {
      const box = new THREE.Box3();
      let any = false;
      for (const p of parts) if (p.visible) { box.expandByObject(p); any = true; }
      if (!any) return;
      const sph = box.getBoundingSphere(new THREE.Sphere());
      const dir = camera.position.clone().sub(controls.target).normalize();
      const d = (sph.radius / Math.sin((camera.fov * Math.PI) / 180 / 2)) * 1.3;
      camera.position.copy(sph.center).add(dir.multiplyScalar(d));
      camera.near = Math.max(d / 100, 0.05); camera.far = d * 10; camera.updateProjectionMatrix();
      controls.target.copy(sph.center); controls.update();
      requestRender();
    }

    // Per-type toggles (built from the parts present).
    if (groupsEl) {
      groupsEl.innerHTML = '';
      for (const t of types) {
        const label = document.createElement('label');
        label.className = 'pv-toggle';
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.checked = typeOn.get(t) !== false;
        cb.addEventListener('change', () => { typeOn.set(t, cb.checked); applyVisibility(); applyHeadFit(); });
        label.append(cb, document.createTextNode(' ' + (TYPE_LABEL[t] || t)));
        groupsEl.appendChild(label);
      }
    }

    // Side selector (Both / one earcup).
    const sideEl = root.querySelector('[data-pv-side]');
    sideEl?.addEventListener('change', () => {
      sideFilter = sideEl.value;
      applyVisibility();
      frameVisible();
      setStatus(sideFilter === 'both' ? '' : `Showing the ${sideFilter === 'R' ? 'right' : 'left'} earcup only`);
    });

    // Click (not drag) to isolate a single part.
    const ray = new THREE.Raycaster();
    const v = new THREE.Vector2();
    canvas.addEventListener('pointerdown', (e) => {
      const x0 = e.clientX, y0 = e.clientY;
      const onUp = (e2) => {
        canvas.removeEventListener('pointerup', onUp);
        if (Math.hypot(e2.clientX - x0, e2.clientY - y0) > 4) return; // it was an orbit drag
        const r = canvas.getBoundingClientRect();
        v.x = ((e2.clientX - r.left) / r.width) * 2 - 1;
        v.y = -((e2.clientY - r.top) / r.height) * 2 + 1;
        ray.setFromCamera(v, camera);
        const hit = ray.intersectObjects(parts, true)[0];   // recursive: into the face-meshes
        if (!hit) return;
        let node = hit.object;                                // walk up to the whole-part node
        while (node && !parts.includes(node)) node = node.parent;
        if (!node) return;
        isolated = node;
        for (const p of parts) p.visible = p === node;
        setStatus(`Isolated: ${prettyName(node.name)} — Reset to show all`);
        requestRender();
      };
      canvas.addEventListener('pointerup', onUp);
    });

    resetEl?.addEventListener('click', () => {
      sideFilter = 'both'; if (sideEl) sideEl.value = 'both';
      for (const t of types) typeOn.set(t, !contextTypes.has(t));   // restore defaults (head stays off)
      groupsEl?.querySelectorAll('input').forEach((cb, i) => { cb.checked = typeOn.get(types[i]) !== false; });
      if (explodeEl) { explodeEl.value = '0'; }
      applyVisibility();
      applyHeadFit();
      applyExplode(0);
      frameVisible();
      setStatus('');
    });

    function resize() {
      const w = canvas.clientWidth || 640, h = canvas.clientHeight || 460;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      requestRender();
    }
    new ResizeObserver(resize).observe(canvas);
    resize();

    // Reference head (and any context types) start OFF.
    applyVisibility();
    applyHeadFit();

    // Soft CONTACT SHADOW (a radial-gradient blob under the model) so it sits on a surface
    // instead of floating — the main thing that made the plain model-viewer read richer.
    {
      const box = fitBox();
      if (!box.isEmpty()) {
        const c = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const cv = document.createElement('canvas'); cv.width = cv.height = 256;
        const g2 = cv.getContext('2d');
        const grad = g2.createRadialGradient(128, 128, 12, 128, 128, 128);
        grad.addColorStop(0, 'rgba(22,26,32,0.40)');
        grad.addColorStop(0.55, 'rgba(22,26,32,0.14)');
        grad.addColorStop(1, 'rgba(22,26,32,0)');
        g2.fillStyle = grad; g2.fillRect(0, 0, 256, 256);
        const span = Math.max(size.x, size.z) * 2.4;
        shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(span, span),
          new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
        shadow.rotation.x = -Math.PI / 2;                       // horizontal (XZ); model is Y-up
        shadow.renderOrder = -1;
        scene.add(shadow);
        placeShadow();                                          // park it under the visible model (head-aware)
      }
    }

    // Premium AUTO-ROTATE on load; stops the instant the user grabs or explodes it (then the
    // viewer goes back to 0%-idle on-demand rendering).
    controls.autoRotate = true; controls.autoRotateSpeed = 1.1;
    let spinning = true;
    const stopSpin = () => { if (!spinning) return; spinning = false; controls.autoRotate = false; };
    canvas.addEventListener('pointerdown', stopSpin);
    explodeEl?.addEventListener('input', stopSpin);
    (function spin() {
      if (!spinning) return;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(spin);
    })();

    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', 'Daily Driver 3D parts viewer — drag to orbit, use the slider to explode, click a part to isolate it');
    setStatus('');
    requestRender();
  }
}

function prettyName(name) {
  const side = /_R\b/.test(name) ? ' (right)' : /_L\b/.test(name) ? ' (left)' : '';
  return name.replace(/_(R|L)\b/, '').replace(/_(p|m)\b/, '').replace(/_/g, ' ') + side;
}
