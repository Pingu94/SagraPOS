import { execSync } from 'node:child_process';
import * as fs from 'node:fs'

// Clean build directories
console.log('Cleaning build directories');
if (fs.existsSync('./electron/src/dist'))
    fs.rmSync('./electron/src/dist', { recursive: true, force: true });
if (fs.existsSync('./backend/dist'))
    fs.rmSync('./backend/dist', { recursive: true, force: true });
if (fs.existsSync('./frontend/dist'))
    fs.rmSync('./frontend/dist', { recursive: true, force: true });
// Update NPM
execSync('npm install', {
    cwd: './backend',
    stdio: 'inherit'
})
execSync('npm install --legacy-peer-deps', {
    cwd: './frontend',
    stdio: 'inherit'
})
execSync('npm install', {
    cwd: './electron',
    stdio: 'inherit'
})
// Build backend
console.log('Building backend');
execSync('npx tsc -b', {
    cwd: './backend',
    stdio: 'inherit'
})
// Build frontend
console.log('Building frontend');
execSync('npm run build -- --configuration production --output-hashing none', {
    cwd: './frontend',
    stdio: 'inherit'
})
// Copy backend into electron
console.log('Coping backend into electron');
fs.cpSync('./backend/dist', './electron/src/dist', { recursive: true })
// Copy frontend into electron
console.log('Coping frontend into electron');
fs.cpSync('./frontend/dist', './electron/src/dist/backend/src/angular', { recursive: true })
// Run electron
if (process.argv[2] === 'run') {
    console.log('Running electron');
    execSync('npm start', {
        cwd: './electron',
        stdio: 'inherit'
    })
} 
else if(process.argv[2] === 'package') {
    console.log('Packaging electron');
    execSync('npm run make', {
        cwd: './electron',
        stdio: 'inherit'
    })
} else {
    console.log('Unrecognized command');
    console.log('Choose between: run, package');
}
