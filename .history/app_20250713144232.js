// Safe initialization wrapper
document.addEventListener('DOMContentLoaded', function() {
    // Viewer with proper configuration
    const viewer = new Marzipano.Viewer(
        document.getElementById('pano'), 
        {
            controls: {
                mouseViewMode: "drag",
                scrollZoom: false // Prevents conflict
            }
        }
    );

    // Image source
    const source = Marzipano.ImageUrlSource.fromString(
        "assets\panorama.png"
    );

    // Geometry settings
    const geometry = new Marzipano.EquirectGeometry([{ 
        width: 4000,
        height: 2000 
    }]);

    // View parameters
    const viewLimits = {
        yaw: { min: -Math.PI, max: Math.PI },
        pitch: { min: -Math.PI/2, max: Math.PI/2 },
        fov: { min: Math.PI/4, max: Math.PI/2 }
    };
    const view = new Marzipano.RectilinearView(
        { yaw: 0, pitch: 0, fov: Math.PI/2 },
        viewLimits
    );

    // Create and display scene
    const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
    });
    scene.switchTo();

    // Hotspot function (working version)
    function addHotspot(yaw, pitch) {
        const element = document.createElement('div');
        element.className = 'hotspot';
        element.innerHTML = '●';
        
        scene.hotspotContainer().createHotspot(element, { yaw, pitch });
    }

    // Add sample hotspots
    addHotspot(0, 0); // Center
    addHotspot(1.0, 0.3); // Right side
});