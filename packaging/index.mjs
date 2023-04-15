import 'zx/globals'

// get postgres version from argv
if (!argv.pgVersion) {
    console.error('Please specify the Postgres version to package for')
    process.exit(1)
}

let pgVersion = argv.pgVersion
console.log(`Packaging PeerDB FDW for Postgres: ${pgVersion}`)

// get repo root path
let repoRoot = await $`git rev-parse --show-toplevel`
repoRoot = repoRoot.stdout.trim()
console.log(`Repo root: ${repoRoot}`)

// create a temporary working directory
let tmpDir = await $`mktemp -d`
tmpDir = tmpDir.stdout.trim()
console.log(`Temporary working directory: ${tmpDir}`)

// within the temporary working directory, we create a directory called
// 'postgresql-$pgVersion-peerdb'
let extName = `postgresql-${pgVersion}-peerdb-fdw`
let pgDir = `${tmpDir}/${extName}`
await $`mkdir ${pgDir}`
cd(pgDir)

// within pgDir, we create postgres extension directory structure
let soDir = `${pgDir}/usr/lib/postgresql/${pgVersion}/lib`
let shareDir = `${pgDir}/usr/share`
let extDir = `${pgDir}/postgresql/${pgVersion}/extension`

await $`mkdir -p ${soDir}`
await $`mkdir -p ${shareDir}`
await $`mkdir -p ${extDir}`

// copy the extension files to the correct locations
await $`cp ${repoRoot}/postgres_fdw.so ${soDir}`
await $`cp ${repoRoot}/postgres_fdw.control ${extDir}`

// copy all sql files to the ext directory
await $`cp -v ${repoRoot}/postgres_fdw*.sql ${extDir}`

// create the debian package
let debFolder = `${pgDir}/DEBIAN`
await $`mkdir ${debFolder}`

// create the control file
let controlFile = `${debFolder}/control`
await $`touch ${controlFile}`
await $`echo "Package: ${extName}" >> ${controlFile}`
await $`echo "Version: 1.2" >> ${controlFile}`
await $`echo "Section: base" >> ${controlFile}`
await $`echo "Priority: optional" >> ${controlFile}`
await $`echo "Architecture: amd64" >> ${controlFile}`
await $`echo "Depends: postgresql-${pgVersion}" >> ${controlFile}`
await $`echo "Maintainer: PeerDB <founders@peerdb.io>" >> ${controlFile}`
await $`echo "Description: PeerDB FDW for Postgres ${pgVersion}" >> ${controlFile}`
await $`echo " This package contains the PeerDB FDW for Postgres ${pgVersion}" >> ${controlFile}`

// create the debian package
await $`dpkg-deb --build ${pgDir}`

// copy the package to the repo root
await $`cp ${pgDir}.deb ${repoRoot}`
