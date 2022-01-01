let stage = new Entity()
stage.addComponent(new GLTFShape("models/Theatre.gltf"))
stage.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(0, 90, 0)
}))
engine.addEntity(stage)
// Define a reusable Cylinder shape component
let CylinderWCollisions = new CylinderShape()
CylinderWCollisions.withCollisions = true
// Create the first wheel entity
let wheel1 = new Entity()
wheel1.addComponent(CylinderWCollisions)
wheel1.addComponent(new Transform({
  position: new Vector3(6, 2, 11.9),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(1, 0.05, 1)
}))
engine.addEntity(wheel1)
// Create a second wheel entity
let wheel2 = new Entity()
wheel2.addComponent(CylinderWCollisions)
wheel2.addComponent(new Transform({
  position: new Vector3(10, 2, 11.9),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(1, 0.05, 1)
}))
engine.addEntity(wheel2)
// Create texture
const spiralTexture = new Texture("materials/hypno-wheel.png")

// Create material
let spiralMaterial = new Material()
spiralMaterial.albedoTexture = spiralTexture

// Add material to wheels
wheel1.addComponent(spiralMaterial)
wheel2.addComponent(spiralMaterial)


@Component('wheelSpin')
export class WheelSpin {
  active: boolean = false
  speed: number = 30
  direction: Vector3 = Vector3.Up()
}
wheel1.addComponent(new WheelSpin())
wheel2.addComponent(new WheelSpin())
wheel2.getComponent(WheelSpin).direction = Vector3.Down()
const wheels = engine.getComponentGroup(WheelSpin)
wheel1.addComponent(
    new OnPointerDown(e => {
      let spin = wheel1.getComponent(WheelSpin)
      if (!spin.active){
        spin.active = true
      } else {
        spin.speed += 20
      }
      //log("speed: ", spin.speed)
    })
)

wheel2.addComponent(
    new OnPointerDown(e => {
      let spin = wheel2.getComponent(WheelSpin)
      if (!spin.active){
        spin.active = true
      } else {
        spin.speed += 30
      }
      //log("speed: ", spin.speed)
    })
)
export class RotatorSystem implements ISystem {
  update(dt: number) {
    for (let wheel of wheels.entities) {
      let spin = wheel.getComponent(WheelSpin)
      let transform = wheel.getComponent(Transform)
      if (spin.active){
        transform.rotate(spin.direction, spin.speed * dt)
      }
    }
  }
}
engine.addSystem(new RotatorSystem())