// Generate realistic star catalog data for cosmos visualization
const fs = require('fs');
const path = require('path');

// Color temperature mapping (based on stellar classification)
const starColors = [
  '#9bb0ff', // Blue-white (O, B type stars)
  '#aabfff', // Blue-white
  '#cad7ff', // White (A type)
  '#f8f7ff', // White
  '#fff4ea', // Yellow-white (F type)
  '#ffd2a1', // Yellow (G type - like our Sun)
  '#ffcc6f', // Orange (K type)
  '#ff9966', // Orange-red
  '#ff6633', // Red (M type)
];

// Named bright stars (magnitude < 1.5)
const namedStars = [
  {name: "Sirius", magnitude: -1.46, color: "#9bb0ff"},
  {name: "Canopus", magnitude: -0.72, color: "#ffd2a1"},
  {name: "Rigil Kentaurus", magnitude: -0.27, color: "#fff4ea"},
  {name: "Arcturus", magnitude: -0.04, color: "#ffd2a1"},
  {name: "Vega", magnitude: 0.03, color: "#f8f7ff"},
  {name: "Capella", magnitude: 0.08, color: "#fff4ea"},
  {name: "Rigel", magnitude: 0.12, color: "#9bb0ff"},
  {name: "Procyon", magnitude: 0.18, color: "#fff4ea"},
  {name: "Betelgeuse", magnitude: 0.34, color: "#ffcc6f"},
  {name: "Achernar", magnitude: 0.40, color: "#ffd2a1"},
  {name: "Hadar", magnitude: 0.46, color: "#9bb0ff"},
  {name: "Altair", magnitude: 0.50, color: "#fffaf0"},
  {name: "Aldebaran", magnitude: 0.58, color: "#ffd2a1"},
  {name: "Antares", magnitude: 0.96, color: "#ff6633"},
  {name: "Spica", magnitude: 1.04, color: "#9bb0ff"},
  {name: "Pollux", magnitude: 1.14, color: "#ffd2a1"},
  {name: "Fomalhaut", magnitude: 1.16, color: "#f8f7ff"},
  {name: "Deneb", magnitude: 1.25, color: "#f8f7ff"},
  {name: "Regulus", magnitude: 1.35, color: "#cad7ff"},
  {name: "Adhara", magnitude: 1.50, color: "#9bb0ff"},
];

function generateStar(id, magnitude) {
  // Generate position in spherical coordinates, then convert to Cartesian
  // This creates a more realistic stellar distribution
  const distance = 5 + Math.random() * 10; // Distance from center
  const theta = Math.random() * Math.PI * 2; // Azimuthal angle
  const phi = Math.acos(2 * Math.random() - 1); // Polar angle (uniform on sphere)

  const x = parseFloat((distance * Math.sin(phi) * Math.cos(theta)).toFixed(3));
  const y = parseFloat((distance * Math.sin(phi) * Math.sin(theta)).toFixed(3));
  const z = parseFloat((distance * Math.cos(phi)).toFixed(3));

  // Assign color based on magnitude and random stellar type
  // Brighter stars tend to be bluer (statistical bias)
  let colorIndex;
  if (magnitude < 2) {
    colorIndex = Math.floor(Math.random() * 4); // Brighter = bluer
  } else if (magnitude < 4) {
    colorIndex = Math.floor(Math.random() * 7);
  } else {
    colorIndex = Math.floor(Math.random() * starColors.length);
  }

  const star = {
    id,
    x,
    y,
    z,
    magnitude: parseFloat(magnitude.toFixed(2)),
    color: starColors[colorIndex]
  };

  return star;
}

function generateStarCatalog(totalStars = 5044) {
  const stars = [];

  // Add named bright stars first
  namedStars.forEach((namedStar, index) => {
    const distance = 5 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    stars.push({
      id: index + 1,
      x: parseFloat((distance * Math.sin(phi) * Math.cos(theta)).toFixed(3)),
      y: parseFloat((distance * Math.sin(phi) * Math.sin(theta)).toFixed(3)),
      z: parseFloat((distance * Math.cos(phi)).toFixed(3)),
      magnitude: namedStar.magnitude,
      color: namedStar.color,
      name: namedStar.name
    });
  });

  // Generate remaining stars with realistic magnitude distribution
  // Most stars are faint (higher magnitude numbers)
  for (let i = namedStars.length; i < totalStars; i++) {
    // Exponential distribution for magnitudes (more faint stars)
    const u = Math.random();
    const magnitude = 1.5 + (-Math.log(1 - u) * 1.5); // Range: 1.5 to ~6.5
    const clampedMagnitude = Math.min(magnitude, 6.5);

    stars.push(generateStar(i + 1, clampedMagnitude));
  }

  const catalog = {
    metadata: {
      catalog: "Cosmos Visualization Dataset",
      total_stars: totalStars,
      coordinate_system: "Cartesian (scaled from celestial coordinates)",
      magnitude_range: [-1.46, 6.5],
      description: "Star positions based on real astronomical coordinates, scaled for 3D visualization"
    },
    stars
  };

  return catalog;
}

// Generate and save - DOUBLED for more awe-inspiring effect!
const catalog = generateStarCatalog(10088);
const outputPath = path.join(__dirname, '..', 'public', 'data.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));

console.log(`Generated ${catalog.stars.length} stars`);
console.log(`Saved to: ${outputPath}`);
