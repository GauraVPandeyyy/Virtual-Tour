// Initialize viewer
const viewerOpts = {
    controls: { mouseViewMode: "drag" }
};
const viewer = new Marzipano.Viewer(document.getElementById('pano'), viewerOpts);

// Create source and geometry
const source = Marzipano.ImageUrlSource.fromString(
    "assets/panorama.jpg"
);
const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

// Create view
const view = new Marzipano.RectilinearView({
    yaw: Math.PI/4,
    pitch: 0,
    fov: Math.PI/2
}, {
    yaw: { min: -Math.PI, max: Math.PI },
    pitch: { min: -Math.PI/2, max: Math.PI/2 },
    fov: { min: Math.PI/4, max: Math.PI/2 }
});

// Create scene
const scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
});

// Display scene
scene.switchTo();

// Add control functions
document.getElementById('zoom-in').addEventListener('click', () => {
    const fov = view.fov() * 0.9;
    view.setFov(Math.max(fov, Math.PI/4));
});

document.getElementById('zoom-out').addEventListener('click', () => {
    const fov = view.fov() * 1.1;
    view.setFov(Math.min(fov, Math.PI/2));
});

document.getElementById('fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Hotspot example (add your coordinates)
function addHotspot(yaw, pitch) {
    const hotspotElement = document.createElement('div');
    hotspotElement.className = 'hotspot';
    
    const hotspot = new Marzipano.Hotspot({
        position: { yaw, pitch },
        element: hotspotElement
    });
    
    scene.hotspotContainer().add(hotspot);
}

// Add sample hotspots (customize positions)
addHotspot(0.5, 0);
addHotspot(-0.5, 0.2);