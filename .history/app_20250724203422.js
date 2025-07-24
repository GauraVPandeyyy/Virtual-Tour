// Scene data - replace with your own images and information
const scenes = [
    {
        id: 'Original',
        name: 'Original Room',
        image: './assets/p1.png',
        hotspots: [
            {
                yaw: -0.5,
                pitch: 0.1,
                type: 'scene',
                target: 1,
                title: 'original'
            },
            {
                yaw: 0.5,
                pitch: 0.0,
                type: 'info',
                title: 'can go anywhere',
                content: 'lorem50 bjbfn kyu kya huaa'
            }
        ]
    },
    {
        id: 'living-room',
        name: 'Living Room',
        image: './assets/p2.png',
        hotspots: [
            {
                yaw: 0.5,
                pitch: 0.1,
                type: 'scene',
                target: 1,
                title: 'Go to Kitchen'
            },
            {
                yaw: -0.8,
                pitch: 0.0,
                type: 'info',
                title: 'Comfortable Seating',
                content: 'This spacious living room features comfortable seating for the whole family.'
            }
        ]
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        image: './assets/p3.png',
        hotspots: [
            {
                yaw: 1.2,
                pitch: 0.1,
                type: 'scene',
                target: 0,
                title: 'Back to Living Room'
            },
            {
                yaw: -0.5,
                pitch: 0.1,
                type: 'scene',
                target: 2,
                title: 'Go to Bedroom'
            },
            {
                yaw: 0.0,
                pitch: -0.3,
                type: 'info',
                title: 'Modern Kitchen',
                content: 'Fully equipped kitchen with modern appliances and granite countertops.'
            }
        ]
    },
    {
        id: 'bedroom',
        name: 'Bedroom',
        image: './assets/p4.png',
        hotspots: [
            {
                yaw: -1.0,
                pitch: 0.1,
                type: 'scene',
                target: 1,
                title: 'Back to Kitchen'
            },
            {
                yaw: 0.8,
                pitch: 0.1,
                type: 'scene',
                target: 3,
                title: 'Go to Bathroom'
            },
            {
                yaw: 0.0,
                pitch: 0.0,
                type: 'info',
                title: 'Master Bedroom',
                content: 'Spacious master bedroom with walk-in closet and natural lighting.'
            }
        ]
    },
    {
        id: 'bathroom',
        name: 'Bathroom',
image: './assets/p1.png',        hotspots: [
            {
                yaw: 1.5,
                pitch: 0.1,
                type: 'scene',
                target: 2,
                title: 'Back to Bedroom'
            },
            {
                yaw: -0.2,
                pitch: -0.4,
                type: 'info',
                title: 'Luxury Bathroom',
                content: 'Modern bathroom with premium fixtures and elegant design.'
            }
        ]
    }
];

// Initialize Marzipano
let viewer;
let currentScene = 0;
let autoRotateActive = false;
let activeMarzipanoScene = null;

// Initialize the viewer
function initViewer() {
    viewer = new Marzipano.Viewer(document.getElementById('pano'), {
        controls: { mouseViewMode: "drag" }
    });
    loadScene(0);
}

// Load a specific scene
function loadScene(sceneIndex) {
    const scene = scenes[sceneIndex];

    // Create geometry
    const geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);

    // Create view with proper limiter
    const limiter = Marzipano.RectilinearView.limit.traditional(
        4096,
        120 * Math.PI / 180  // Increased max FOV for better zoom
    );

    const view = new Marzipano.RectilinearView(
        { yaw: 0, pitch: 0, fov: 75 * Math.PI / 180 },
        limiter
    );

    // Create source
    const source = Marzipano.ImageUrlSource.fromString(scene.image);

    // Create scene
    const marzipanoScene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
    });

    // Store active scene reference
    activeMarzipanoScene = marzipanoScene;

    // Add hotspots
    scene.hotspots.forEach(hotspot => {
        const hotspotElement = createHotspot(hotspot);
        marzipanoScene.hotspotContainer().createHotspot(hotspotElement, {
            yaw: hotspot.yaw,
            pitch: hotspot.pitch
        });
    });

    // Switch to scene
    marzipanoScene.switchTo();

    // Update UI
    updateSceneButtons(sceneIndex);
    currentScene = sceneIndex;
}

// Create hotspot element
function createHotspot(hotspot) {
    const element = document.createElement('div');

    if (hotspot.type === 'scene') {
        element.className = 'hotspot';
        element.title = hotspot.title;
        element.addEventListener('click', () => {
            loadScene(hotspot.target);
        });
    } else if (hotspot.type === 'info') {
        element.className = 'info-hotspot';
        element.title = hotspot.title;
        element.addEventListener('click', () => {
            showInfoPanel(hotspot.title, hotspot.content);
        });
    }

    return element;
}

// Update scene navigation buttons
function updateSceneButtons(activeIndex) {
    const buttons = document.querySelectorAll('.scene-btn');
    buttons.forEach((btn, index) => {
        btn.classList.toggle('active', index === activeIndex);
    });
}

// Show info panel
function showInfoPanel(title, content) {
    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoContent').textContent = content;
    document.getElementById('infoPanel').style.display = 'block';
}

// Zoom functions (FIXED VERSION)
function zoomIn() {
    if (!activeMarzipanoScene) return;

    const view = activeMarzipanoScene.view();
    const currentFov = view.fov();
    const newFov = Math.max(currentFov * 0.8, 5 * Math.PI / 180); // Min 20 degrees
    view.setFov(newFov);
}

function zoomOut() {
    if (!activeMarzipanoScene) return;

    const view = activeMarzipanoScene.view();
    const currentFov = view.fov();
    const newFov = Math.min(currentFov * 1.25, 120 * Math.PI / 180); // Max 120 degrees
    view.setFov(newFov);
}

// Initialize controls
function initControls() {
    // Scene navigation
    document.querySelectorAll('.scene-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            loadScene(index);
        });
    });

    // Zoom controls (buttons)
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);

    // Fullscreen
    document.getElementById('fullscreen').addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });

    // Auto rotate
    document.getElementById('autoRotate').addEventListener('click', () => {
        autoRotateActive = !autoRotateActive;
        if (autoRotateActive) {
            startAutoRotate();
            document.getElementById('autoRotate').textContent = 'Stop Rotate';
        } else {
            stopAutoRotate();
            document.getElementById('autoRotate').textContent = 'Auto Rotate';
        }
    });

    // Close info panel
    document.getElementById('closeInfo').addEventListener('click', () => {
        document.getElementById('infoPanel').style.display = 'none';
    });

    // Click outside to close info panel
    document.getElementById('infoPanel').addEventListener('click', (e) => {
        if (e.target === document.getElementById('infoPanel')) {
            document.getElementById('infoPanel').style.display = 'none';
        }
    });
}

// Auto rotate functionality
let autoRotateInterval;

function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(() => {
        if (activeMarzipanoScene) {
            const view = activeMarzipanoScene.view();
            const yaw = view.yaw();
            view.setYaw(yaw + 0.01);
        }
    }, 50);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after a delay
    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        document.body.classList.remove('loading');
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }, 1000);

    // Initialize viewer and controls
    initViewer();
    initControls();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentScene > 0) loadScene(currentScene - 1);
            break;
        case 'ArrowRight':
            if (currentScene < scenes.length - 1) loadScene(currentScene + 1);
            break;
        case 'f':
        case 'F':
            document.getElementById('fullscreen').click();
            break;
        case ' ':
            e.preventDefault();
            document.getElementById('autoRotate').click();
            break;
        case '+':
            zoomIn();
            break;
        case '-':
            zoomOut();
            break;
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (viewer) {
        viewer.updateSize();
    }
});

// Mouse wheel zoom handler
document.getElementById('pano').addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!activeMarzipanoScene) return;

    const delta = -e.deltaY * 0.01;
    const view = activeMarzipanoScene.view();
    const currentFov = view.fov();
    const newFov = Math.min(
        Math.max(currentFov + delta, 20 * Math.PI / 180),
        120 * Math.PI / 180
    );
    view.setFov(newFov);
});