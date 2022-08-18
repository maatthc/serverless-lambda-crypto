"use strict"
const cryptoNode = require("crypto")
const cryptoJs = require("crypto-js")
const axios = require("axios")
const { performance, PerformanceObserver } = require("perf_hooks")

const jsonPayloadUrl = "https://jsonplaceholder.typicode.com/photos"
const algorithms = ["MD5", "SHA1", "SHA256", "SHA512", "SHA3", "RIPEMD160"]
let counter = 0
let results = []

module.exports.cryptoPerf = async (event) => {
  const jsonPayload = await axios.get(jsonPayloadUrl)
  const payload = JSON.stringify(jsonPayload.data)
  run(payload)
}

const generateHash = (algorithm, data, engine) => {
  if (engine === "node") {
    return cryptoNode.createHash(algorithm).update(data).digest("hex")
  }
  return cryptoJs[algorithm](data).toString()
}

const run = (data) => {
  for (let engine of ["node", "crypto-js"]) {
    for (let algorithm of algorithms) {
      try {
        const perfObserver = new PerformanceObserver((list) => {
          console.log(results[counter], list.getEntries()[0].duration)
          counter += 1
          performance.clearMarks()
          perfObserver.disconnect()
        })
        perfObserver.observe({ entryTypes: ["function"] })
        results.push(`${engine} : ${algorithm}`)
        const perfWrapper = performance.timerify(generateHash)
        const hash = perfWrapper(algorithm, data, engine)
        console.log(`${engine}:${algorithm}\t: ${hash}`)
      } catch (_err) {
        console.log(`${engine}:${algorithm}\t: Not supported`)
      }
    }
  }
}
