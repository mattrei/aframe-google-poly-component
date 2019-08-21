(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* global AFRAME */\nif (typeof AFRAME === 'undefined') {\n  throw new Error('Component attempted to register before AFRAME was available.');\n}\n\nconst POLY_API_URL = 'https://poly.googleapis.com/v1/assets/';\n/**\n * Google Poly component for A-Frame.\n */\n\nAFRAME.registerComponent('google-poly', {\n  schema: {\n    apiKey: {\n      default: ''\n    },\n    src: {},\n    normalize: {\n      type: 'boolean',\n      default: true\n    }\n  },\n  multiple: false,\n  init: function () {\n    this.model = null;\n  },\n  update: function (oldData) {\n    const el = this.el;\n    const data = this.data;\n    if (!data.src || !data.apiKey) return;\n    this.remove();\n    this.getGLTFUrl(data.src, data.apiKey).then(this.loadPolyModel).then(gltfModel => {\n      this.model = gltfModel.scene || gltfModel.scenes[0];\n      this.model.animations = gltfModel.animations;\n      el.setObject3D('mesh', this.model); //el.emit('model-loaded', {format: 'gltf', model: this.model})\n\n      if (data.normalize) {\n        this.normalize();\n      }\n\n      el.emit('model-loaded');\n    }).catch(err => {\n      console.error('ERROR loading Google Poly model from \"' + data.src + '\" : ' + err);\n      el.emit('model-error', err);\n    });\n  },\n  normalize: function () {\n    const el = this.el;\n    const mesh = el.getObject3D('mesh');\n    const span = 1;\n    const offset = new THREE.Vector3(); // data.offset?\n\n    const position = new THREE.Vector3();\n    const scale = new THREE.Vector3();\n    position.copy(el.object3D.position);\n    scale.copy(el.object3D.scale);\n    el.object3D.scale.set(1, 1, 1);\n    el.object3D.position.set(0, 0, 0);\n    el.object3D.updateMatrixWorld(true); // https://github.com/mrdoob/three.js/blob/master/src/core/Geometry.js#L367\n\n    const box = new THREE.Box3();\n    box.setFromObject(mesh);\n    const boundingSphere = new THREE.Sphere();\n    box.getBoundingSphere(boundingSphere);\n    const center = boundingSphere.center;\n    const radius = boundingSphere.radius;\n    const s = (radius === 0 ? 1 : 1.0 / radius) * span;\n    mesh.traverse(child => {\n      if (child.isMesh) {\n        child.geometry.scale(s, s, s);\n        child.geometry.translate(-s * center.x + offset.x, -s * center.y + offset.y, -s * center.z + offset.z);\n        child.geometry.computeBoundingBox();\n        child.geometry.computeBoundingSphere();\n      }\n    });\n    el.object3D.scale.copy(scale);\n    el.object3D.position.copy(position);\n    el.object3D.updateMatrixWorld(true);\n  },\n  _remove: function () {\n    if (this.model) this.el.removeObject3D('mesh');\n  },\n  remove: function () {\n    this._remove();\n  },\n  getGLTFUrl: function (id, apiKey) {\n    const url = POLY_API_URL + id + '/?key=' + apiKey; // try cache\n\n    /*\n    var getUrlPromise = promiseCache.get(url)\n    if (!getUrlPromise) {\n    */\n\n    return getUrlPromise = fetch(url).then(function (response) {\n      // parse response\n      return response.json().catch(error => {\n        // handle JSON parsing error\n        console.log('ERROR parsing Google Poly API server response JSON.\\nRequested Model: \"' + url + '\"\\nError: \"' + JSON.stringify(error) + '\"');\n        return Promise.reject('Google Poly API server error. Check console for details.');\n      }).then(info => {\n        if (info.error !== undefined) {\n          return Promise.reject('Poly API error: ' + info.error.message);\n        }\n\n        const format = info.formats.find(format => {\n          return format.formatType === 'GLTF' || format.formatType === 'GLTF2';\n        });\n\n        if (format) {\n          const r = info.presentationParams.orientingRotation;\n          const quaternion = new THREE.Quaternion(r.x || 0, r.y || 0, r.z || 0, r.w || 1);\n          return {\n            url: format.root.url,\n            quaternion: quaternion\n          };\n        } else {\n          return Promise.reject('Poly asset id:' + id + ' not provided in GLTF2 format.');\n        }\n      });\n    });\n    /*\n      // add to cache\n      promiseCache.add(url, getUrlPromise)\n     }\n     return getUrlPromise\n    */\n  },\n  loadPolyModel: function (data, onProgress) {\n    const url = data.url;\n    const quaternion = data.quaternion;\n    const matrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);\n    return new Promise((resolve, reject) => {\n      const loader = new THREE.FileLoader();\n      loader.setResponseType('arraybuffer');\n      loader.load(url, data => {\n        try {\n          const gltfLoader = new THREE.GLTFLoader();\n          const path = THREE.LoaderUtils.extractUrlBase(url);\n          gltfLoader.parse(data, path, gltf => {\n            gltf.scene.traverse(function (child) {\n              if (child.geometry) child.geometry.applyMatrix(matrix);\n            });\n            resolve(gltf);\n          }, reject);\n        } catch (e) {\n          // For SyntaxError or TypeError, return a generic failure message.\n          reject(e.constructor === Error ? e : new Error('THREE.GLTFLoader: Unable to parse model.'));\n        }\n      }, onProgress, reject);\n    });\n  }\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });
});