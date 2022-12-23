import * as THREE from 'three'
import { Mesh, Group, Object3D, InstancedMesh } from 'three'

import { Octree } from 'three/examples/jsm/math/Octree.js'
import { OctreeHelper } from './OctreeHelper.js'

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

function _convertMeshesToInstancedMeshes(app) {
  const { scene } = app.glb
  
  const instances = {}
  
  app.traverse(o => {
    if (o.isMesh) {
      let { geometry, material } = o

      let instanceId = `${geometry.uuid}-${material.uuid}`

      if (instances[instanceId] === undefined) instances[instanceId] = []
      instances[instanceId].push(o)
    }
  })
  
  for (let o of Object.values(instances)) {
    if (o.length < 2) continue

    const { geometry, material } = o[0]
    const instancedMesh = new InstancedMesh(geometry, material, o.length)

    for (let i in o) {
      let mesh = o[i]
      instancedMesh.setMatrixAt(i, mesh.matrixWorld)
      // mesh.removeFromParent()
      mesh.visible = false
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    scene.add(instancedMesh)
  }
  
}

function _buildSceneOctree(app) {
  const { scene } = app.glb

  const worldOctree = new Octree()

  app.traverse(o => {
    if (o.name === 'Cube002_DisplayMesh') {
      console.log('trying to build octree...')
      
      worldOctree.fromGraphNode(o)
    }
  })

  const helper = new OctreeHelper(worldOctree)

  helper.visible = true
	scene.add(helper)

}

export default e => {
  
  const app = useApp()

  e.waitUntil((async () => {
    
    const modelUrl = `${baseUrl}webaverse-ld-block-kit-01.glb`
    const model = await metaversefile.import(modelUrl)
    await app.addModule(model)

    // _buildSceneOctree(app)
    _convertMeshesToInstancedMeshes(app)
    
  })())
  
  return app
  
}
