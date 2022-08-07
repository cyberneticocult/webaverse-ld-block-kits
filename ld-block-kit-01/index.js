import * as THREE from 'three'

import metaversefile from 'metaversefile'
const { useApp } = metaversefile

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1')

const localVector = new THREE.Vector3()
const localVector2 = new THREE.Vector3()
const localVector3 = new THREE.Vector3()
const localVector4 = new THREE.Vector3()
const localTriangle = new THREE.Triangle()
const localMatrix = new THREE.Matrix4()
const localMatrix2 = new THREE.Matrix4()

export default e => {
  
  const app = useApp()

  e.waitUntil((async () => {
    
    const modelUrl = `${baseUrl}webaverse-ld-block-kit-01.glb`
    const model = await metaversefile.import(modelUrl)
    
    app.addModule(model)
    
  })())
  
  return app
  
}
