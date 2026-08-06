import * as THREE from 'three'

export default class WebGLBackground {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private clock: THREE.Clock
  private core: THREE.Mesh
  private corePoints: THREE.Points
  private rings: THREE.Group
  private stars: THREE.Points
  private wireMat: THREE.MeshBasicMaterial
  private pointsMat: THREE.PointsMaterial
  private geo: THREE.IcosahedronGeometry
  private basePositions: Float32Array
  private scrollProgress: number = 0
  private mouseX: number = 0
  private mouseY: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.clock = new THREE.Clock()

    /* --- Renderer --- */
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 1)

    /* --- Scene & Camera --- */
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.06)

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.set(0, 0, 6)

    const ACCENT = new THREE.Color(0x6B5B95)
    const FG = new THREE.Color(0x4a4a4a)

    /* --- Core geometry --- */
    this.geo = new THREE.IcosahedronGeometry(1.8, 24)
    this.basePositions = (this.geo.attributes.position.array as Float32Array).slice()

    this.wireMat = new THREE.MeshBasicMaterial({
      color: ACCENT,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    this.core = new THREE.Mesh(this.geo, this.wireMat)
    this.scene.add(this.core)

    this.pointsMat = new THREE.PointsMaterial({
      color: FG,
      size: 0.012,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })
    this.corePoints = new THREE.Points(this.geo, this.pointsMat)
    this.scene.add(this.corePoints)

    /* --- Orbit rings --- */
    this.rings = new THREE.Group()
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.6 + i * 0.55, 0.0035, 8, 200),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? ACCENT : FG,
          transparent: true,
          opacity: i === 1 ? 0.6 : 0.35,
        })
      )
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.35
      ring.rotation.y = i * 0.6
      this.rings.add(ring)
    }
    this.scene.add(this.rings)

    /* --- Background particle field --- */
    const starCount = 900
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3 + 0] = (Math.random() - 0.5) * 30
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 30
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    this.stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: FG,
        size: 0.018,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
      })
    )
    this.scene.add(this.stars)
  }

  private displace(x: number, y: number, z: number, t: number, amp: number): number {
    const n =
      Math.sin(x * 2.1 + t * 0.9) * 0.5 +
      Math.sin(y * 2.7 - t * 0.7) * 0.35 +
      Math.sin(z * 3.3 + t * 1.2) * 0.25 +
      Math.sin((x + y + z) * 1.5 - t * 0.5) * 0.4
    return 1 + n * amp
  }

  public tick = () => {
    const t = this.clock.getElapsedTime()
    const p = this.scrollProgress

    const amp = 0.14 + Math.sin(p * Math.PI) * 0.38

    const pos = this.geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3
      const bx = this.basePositions[ix]
      const by = this.basePositions[ix + 1]
      const bz = this.basePositions[ix + 2]
      const s = this.displace(bx, by, bz, t, amp)
      pos.array[ix] = bx * s
      pos.array[ix + 1] = by * s
      pos.array[ix + 2] = bz * s
    }
    pos.needsUpdate = true

    this.core.rotation.y = t * 0.12 + p * Math.PI * 2.5
    this.core.rotation.x = p * Math.PI * 0.8
    this.corePoints.rotation.copy(this.core.rotation)

    const scale = 1 - p * 0.45
    this.core.scale.setScalar(scale)
    this.corePoints.scale.setScalar(scale)

    this.rings.rotation.z = t * 0.05 + p * Math.PI
    this.rings.rotation.x = p * 1.2
    this.rings.scale.setScalar(1 + p * 0.6)

    this.stars.rotation.y = t * 0.01 + p * 0.6

    this.camera.position.z = 6 + p * 3.5
    this.camera.position.y = -p * 1.2 + this.mouseY * -0.15
    this.camera.position.x = Math.sin(p * Math.PI) * 1.4 + this.mouseX * 0.2
    this.camera.lookAt(0, 0, 0)

    this.wireMat.opacity = 0.5 + Math.sin(p * Math.PI) * 0.2
    this.pointsMat.opacity = 0.8 - p * 0.3

    this.renderer.render(this.scene, this.camera)
  }

  public setScrollProgress(progress: number, mouseX: number, mouseY: number) {
    this.scrollProgress = progress
    this.mouseX = mouseX
    this.mouseY = mouseY
  }

  public handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  public dispose() {
    this.renderer.dispose()
    this.geo.dispose()
    this.wireMat.dispose()
    this.pointsMat.dispose()
  }
}