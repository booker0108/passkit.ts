import * as Crypto from 'crypto'
import * as Process from 'child_process'
import { certtificates } from './index'

export default class Manifest {

    data: { [key: string]: string } = {}

    async addFile(buffer: Buffer, filename: string, encoding: Crypto.Utf8AsciiLatin1Encoding) {
        const hash: Crypto.Hash = Crypto.createHash('sha1')
        this.data[filename] = hash.update(buffer, encoding).digest('hex')
    }

    toJSON(): { [key: string]: string } {
        return this.data
    }

    async sign(passTypeIdentifier: string, manifestBuffer) {
        
        try {
            await certtificates.loadIfNeeded()
        } catch(error) {
            throw error
        }

        const args = [
            "smime",
            "-sign", "-binary",
            "-signer", certtificates.secret,
            "-certfile", certtificates.wwdr,
            "-passin", "pass:" + certtificates.options.password
        ]

        const promise = new Promise<Buffer>((resolve, reject) => {
            const smime: Process.ChildProcess = Process.execFile('openssl', args, { encoding: "utf8" }, (error, stdout, stderr) => { 
                if (error) {
                    reject(error)
                    return
                }
                if (stderr) {
                    reject(new Error(stderr))
                    return
                }
                const signature = stdout.split(/\n\n/)[3]
                resolve(new Buffer(signature, 'base64'))
            })
            smime.stdin.write(manifestBuffer)
            smime.stdin.end()
        })
        return promise
    }
}