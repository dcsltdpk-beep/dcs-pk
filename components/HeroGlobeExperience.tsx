'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const BLUE = [79, 180, 255];
const GOLD = [249, 171, 63];
const MAP_BRIGHT_CYAN = [120, 235, 255]; // Bright luminous cyan to highlight dry areas of Earth
const MAP_ELECTRIC = [70, 215, 255];   // Electric cyan for landmass glow wash
const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// -------------------------------------------------------------
// REAL-WORLD CONTINENT GEOGRAPHY (Longitude, Latitude)
// Detailed vector outlines for Africa, Europe, Asia, Americas, Australia
// -------------------------------------------------------------
const CONTINENT_POLYGONS: [number, number][][] = [
  // 1. AFRICA (Centerpiece)
  [
    [-5.8, 35.8], [-7.6, 33.6], [-9.5, 30.5], [-13.2, 27.1], [-15.9, 23.7],
    [-17.0, 20.9], [-17.4, 14.7], [-16.6, 13.4], [-15.6, 11.8], [-13.7, 9.5],
    [-10.8, 6.3], [-7.5, 4.3], [-4.0, 5.3], [-0.2, 5.5], [1.2, 6.1], [3.4, 6.5],
    [7.0, 4.8], [9.7, 4.0], [9.4, 0.4], [11.8, -4.8], [13.2, -8.8], [13.4, -12.6],
    [14.5, -22.9], [15.2, -26.6], [17.9, -33.0], [18.4, -33.9], [20.0, -34.8],
    [25.6, -33.9], [31.0, -29.9], [32.6, -25.9], [34.8, -19.8], [40.7, -14.5],
    [39.3, -6.8], [39.7, -4.0], [42.5, -0.5], [45.3, 2.0], [49.0, 8.0],
    [51.2, 10.4], [45.0, 10.4], [43.1, 11.6], [39.5, 15.6], [37.2, 19.6],
    [33.8, 27.2], [32.5, 29.9], [31.2, 30.0], [29.9, 31.2], [23.9, 32.1],
    [20.0, 32.1], [16.6, 31.2], [13.2, 32.9], [10.2, 36.8], [3.0, 36.7],
    [-0.6, 35.7], [-5.8, 35.8]
  ],
  // 2. MADAGASCAR
  [
    [49.3, -12.3], [49.4, -18.1], [47.5, -18.9], [44.5, -24.5],
    [43.7, -23.3], [44.4, -16.0], [49.3, -12.3]
  ],
  // 3. EUROPE & MEDITERRANEAN
  [
    [-9.1, 38.7], [-8.6, 41.1], [-8.4, 43.4], [-2.9, 43.3], [-0.6, 44.8],
    [-4.5, 48.4], [2.35, 48.8], [4.9, 52.4], [10.0, 53.5], [12.6, 55.7],
    [10.7, 59.9], [18.0, 59.3], [25.0, 60.2], [37.6, 55.7], [30.5, 50.4],
    [26.1, 44.4], [28.9, 41.0], [23.7, 38.0], [20.0, 39.5], [16.0, 41.0],
    [14.3, 40.8], [12.5, 41.9], [9.2, 45.5], [5.4, 43.3], [2.2, 41.4],
    [-0.5, 38.5], [-3.7, 40.4], [-6.0, 37.4], [-9.1, 38.7]
  ],
  // 4. BRITISH ISLES & IRELAND
  [
    [-0.1, 51.5], [-3.2, 55.9], [-4.5, 58.5], [-5.0, 56.0], [-3.0, 51.5],
    [-5.5, 50.0], [-0.1, 51.5]
  ],
  [
    [-6.3, 53.3], [-8.5, 54.5], [-10.0, 52.0], [-6.5, 51.8], [-6.3, 53.3]
  ],
  // 5. SCANDINAVIA, NORWAY & BALTIC
  [
    [5.0, 62.0], [10.0, 64.0], [15.0, 68.0], [25.0, 71.0], [28.0, 70.0],
    [21.0, 65.0], [18.0, 59.3], [12.0, 56.0], [8.5, 57.5], [5.0, 62.0]
  ],
  // 6. RUSSIA, SIBERIA, CENTRAL ASIA & KAZAKHSTAN (Massive closed northern continent)
  [
    [33.0, 69.0], [40.0, 65.0], [50.0, 68.0], [60.0, 70.0], [73.0, 72.0],
    [85.0, 73.0], [100.0, 75.0], [120.0, 73.0], [135.0, 71.0], [150.0, 70.0],
    [165.0, 68.0], [175.0, 65.0], [163.0, 58.0], [156.0, 51.0], [143.0, 53.0],
    [135.0, 48.0], [131.0, 43.0], [125.0, 42.0], [116.0, 40.0], [105.0, 43.0],
    [92.0, 45.0], [82.0, 45.0], [70.0, 48.0], [60.0, 52.0], [52.0, 55.0],
    [40.0, 56.0], [33.0, 65.0], [33.0, 69.0]
  ],
  // 7. MIDDLE EAST & ARABIAN PENINSULA
  [
    [32.5, 29.9], [35.5, 33.9], [36.3, 33.5], [44.4, 33.3], [48.0, 29.4],
    [50.6, 26.2], [51.5, 25.3], [55.3, 25.2], [58.5, 23.6], [54.1, 17.0],
    [45.0, 12.8], [44.2, 15.4], [40.0, 19.0], [39.2, 21.5], [36.0, 26.0],
    [32.5, 29.9]
  ],
  // 8. SOUTH ASIA (PAKISTAN & INDIA)
  [
    [62.3, 25.1], [67.0, 24.9], [70.0, 23.5], [72.6, 23.0], [72.8, 19.0],
    [73.8, 15.3], [75.0, 12.0], [77.5, 8.1], [79.8, 9.8], [80.2, 13.0],
    [83.0, 18.0], [88.4, 22.6], [90.4, 23.8], [88.0, 26.0], [77.2, 28.6],
    [74.3, 31.5], [73.0, 33.7], [71.5, 34.0], [67.0, 30.2], [62.3, 25.1]
  ],
  // Sri Lanka
  [
    [79.8, 6.9], [81.5, 7.5], [81.0, 9.0], [80.0, 8.0], [79.8, 6.9]
  ],
  // 9. CHINA, TIBET, CENTRAL ASIA & INDOCHINA
  [
    [75.0, 36.0], [80.0, 32.0], [88.0, 28.0], [96.0, 24.0], [98.5, 10.0],
    [101.7, 3.1], [104.5, 10.0], [106.6, 10.8], [108.5, 16.0], [105.8, 21.0],
    [110.0, 20.0], [114.1, 22.3], [121.5, 31.2], [119.0, 36.0], [116.4, 39.9],
    [121.0, 41.0], [127.0, 37.5], [129.0, 35.0], [125.0, 34.0], [118.0, 40.0],
    [110.0, 42.0], [100.0, 42.0], [90.0, 43.0], [80.0, 44.0], [75.0, 36.0]
  ],
  // 10. JAPAN ARCHIPELAGO
  [
    [130.5, 31.5], [133.0, 34.0], [135.5, 34.7], [139.7, 35.7], [141.5, 38.3],
    [140.5, 41.8], [144.5, 44.0], [141.0, 43.0], [139.0, 37.0], [133.0, 35.0],
    [130.5, 31.5]
  ],
  // 11. INDONESIA & MARITIME PACIFIC ISLANDS (Sumatra, Java, Borneo, Philippines, New Guinea)
  // Sumatra
  [
    [95.5, 5.5], [98.5, 3.0], [101.5, 0.5], [105.0, -5.0], [106.0, -5.8],
    [104.0, -4.5], [100.0, -1.0], [97.0, 1.5], [95.5, 5.5]
  ],
  // Java
  [
    [105.5, -6.0], [108.5, -6.8], [112.5, -7.0], [114.5, -8.0], [113.0, -8.5],
    [109.0, -7.8], [106.0, -7.0], [105.5, -6.0]
  ],
  // Borneo / Kalimantan
  [
    [109.0, 1.0], [114.0, 4.5], [118.0, 5.0], [119.0, 3.5], [117.0, -1.0],
    [115.0, -3.5], [111.0, -3.0], [109.0, 0.0], [109.0, 1.0]
  ],
  // Philippines
  [
    [120.0, 18.5], [122.0, 18.0], [124.0, 14.0], [126.0, 10.0], [126.0, 7.0],
    [122.0, 7.0], [121.0, 13.0], [120.0, 18.5]
  ],
  // New Guinea
  [
    [131.0, -1.0], [137.0, -2.5], [141.0, -2.5], [148.0, -5.0], [150.0, -10.0],
    [143.0, -8.0], [136.0, -5.0], [131.0, -1.0]
  ],
  // 12. AUSTRALIA & NEW ZEALAND
  [
    [115.8, -31.9], [114.0, -25.0], [118.6, -20.3], [123.0, -16.5],
    [130.8, -12.5], [136.0, -12.0], [142.0, -11.0], [145.8, -16.9],
    [150.0, -23.0], [153.0, -27.5], [151.2, -33.8], [147.0, -38.0],
    [144.9, -37.8], [138.6, -34.9], [130.0, -31.5], [120.0, -34.0],
    [115.8, -31.9]
  ],
  // New Zealand
  [
    [173.0, -35.0], [178.0, -38.0], [176.0, -40.0], [171.0, -44.0], [167.0, -46.5],
    [170.0, -43.0], [174.0, -41.0], [173.0, -35.0]
  ],
  // 13. SOUTH AMERICA (West Horizon / Left Side of Globe)
  [
    [-66.9, 10.5], [-58.0, 6.0], [-48.5, -1.4], [-38.5, -3.7], [-34.9, -8.0],
    [-38.5, -12.9], [-40.0, -20.0], [-43.2, -22.9], [-46.6, -23.5], [-51.2, -30.0],
    [-56.2, -34.9], [-58.4, -34.6], [-65.0, -42.0], [-68.3, -54.8], [-73.0, -50.0],
    [-70.6, -33.4], [-77.0, -12.0], [-80.5, -4.5], [-78.5, -0.2], [-77.0, 3.0],
    [-74.1, 4.7], [-66.9, 10.5]
  ],
  // 14. NORTH AMERICA (Full Continent: Canada, USA, Mexico - Left Side of Globe)
  [
    [-80.5, 25.0], [-81.5, 28.5], [-84.5, 30.5], [-89.0, 30.0], [-94.0, 29.5],
    [-97.5, 26.0], [-97.5, 22.0], [-93.0, 18.5], [-90.5, 21.0], [-87.0, 21.5],
    [-88.5, 18.0], [-92.5, 15.0], [-96.0, 16.0], [-105.0, 20.0], [-109.0, 23.0],
    [-111.0, 26.0], [-115.0, 31.0], [-117.2, 32.7], [-122.0, 37.0], [-124.5, 40.5],
    [-124.5, 46.5], [-123.0, 49.0], [-128.0, 52.0], [-130.0, 54.5], [-135.0, 58.5],
    [-145.0, 60.5], [-155.0, 58.0], [-165.0, 60.0], [-168.0, 65.5], [-160.0, 71.0],
    [-145.0, 70.0], [-130.0, 69.0], [-115.0, 68.0], [-95.0, 67.0], [-85.0, 65.0],
    [-80.0, 62.0], [-82.0, 55.0], [-79.0, 51.5], [-76.0, 58.0], [-68.0, 62.0],
    [-60.0, 56.0], [-55.0, 52.0], [-60.0, 47.0], [-64.0, 45.0], [-70.0, 43.0],
    [-74.0, 40.7], [-75.5, 35.2], [-80.5, 25.0]
  ],
  // 15. CARIBBEAN (Cuba & Hispaniola - Populates Left Side Space)
  [
    [-84.9, 21.8], [-81.5, 23.0], [-79.0, 22.5], [-75.0, 20.0], [-74.2, 20.2],
    [-77.0, 21.5], [-82.0, 22.8], [-84.9, 21.8]
  ],
  [
    [-74.0, 19.8], [-71.5, 19.8], [-68.5, 18.5], [-71.0, 18.0], [-74.0, 18.2],
    [-74.0, 19.8]
  ],
  // 16. CENTRAL AMERICA (Mexico to Panama - Populates Left Side Space)
  [
    [-77.0, 8.0], [-80.0, 8.5], [-83.0, 9.5], [-85.5, 10.5], [-87.5, 13.0],
    [-90.0, 14.0], [-92.0, 15.0], [-96.0, 17.5], [-90.0, 20.5], [-87.5, 21.5],
    [-88.0, 18.0], [-83.5, 15.0], [-80.0, 9.5], [-77.0, 8.0]
  ],
  // 17. GREENLAND (Northwest Top Curve)
  [
    [-45.0, 60.0], [-35.0, 65.0], [-20.0, 75.0], [-35.0, 82.0],
    [-55.0, 78.0], [-50.0, 65.0], [-45.0, 60.0]
  ],
  // 18. ANTARCTICA (Southern Polar Dry Land Horizon)
  [
    [-120.0, -72.0], [-60.0, -68.0], [-10.0, -70.0], [40.0, -68.0], [90.0, -68.0],
    [140.0, -68.0], [170.0, -72.0], [120.0, -82.0], [0.0, -82.0], [-120.0, -72.0]
  ]
];

// -------------------------------------------------------------
// CONTINENT INTERNAL LINES (Interior Rivers, Mountain Spines, Country & Regional Dividers)
// Adds rich internal cartographic detail to all continents
// -------------------------------------------------------------
const CONTINENT_INTERNAL_LINES: [number, number][][] = [
  // --- AFRICA INTERNAL DETAIL LINES ---
  // Trans-Sahara Tropic Line
  [[-13.0, 27.0], [-5.0, 25.0], [5.0, 24.0], [15.0, 24.0], [25.0, 24.0], [33.0, 24.0]],
  // Sahel Interior Divider
  [[-16.0, 15.0], [-8.0, 14.0], [0.0, 14.5], [8.5, 13.0], [15.0, 13.5], [22.0, 14.0], [32.0, 13.0], [42.0, 11.0]],
  // Atlas Mountain Spine (Morocco, Algeria, Tunisia)
  [[-7.6, 33.6], [-2.0, 34.0], [3.0, 35.0], [8.0, 35.5], [10.2, 36.8]],
  // Ahaggar / Tibesti Massif interior cross
  [[1.0, 23.0], [5.5, 22.8], [11.0, 21.0], [17.0, 21.0], [23.0, 20.0]],
  // Nile River Basin Line (Egypt -> Sudan -> Uganda)
  [[31.2, 30.0], [32.0, 26.0], [32.9, 24.0], [32.5, 15.6], [31.6, 9.5], [31.6, 4.8], [32.6, 0.3]],
  // Blue Nile (Sudan -> Ethiopian Highlands)
  [[32.5, 15.6], [35.5, 12.0], [38.7, 9.0], [42.0, 8.0]],
  // Great Rift Valley Spine (Horn -> Kenya -> Tanzania -> Malawi)
  [[43.0, 11.5], [38.7, 9.0], [36.0, 4.0], [36.8, -1.3], [35.0, -6.0], [34.0, -12.0], [35.0, -16.0], [34.8, -19.8]],
  // West Africa Interior Ribs (Senegal/Mali/Niger)
  [[-17.4, 14.7], [-12.0, 13.5], [-8.0, 12.6], [-1.5, 12.4], [2.1, 13.5], [8.5, 12.0], [15.0, 12.1]],
  [[-4.0, 5.3], [-4.0, 9.0], [-1.5, 12.4]],
  [[3.4, 6.5], [7.5, 9.1], [8.5, 12.0]],
  [[9.7, 4.0], [11.5, 3.9], [15.0, 8.0], [15.0, 12.1]],
  // Congo River Basin (Central Africa)
  [[12.0, -5.0], [15.3, -4.3], [20.0, 0.0], [25.2, 0.5], [27.5, -4.0], [27.5, -11.7]],
  [[25.2, 0.5], [29.0, -2.5], [30.1, -1.9], [32.6, 0.3]],
  // Southern Africa Regional Dividing Lines
  [[13.2, -8.8], [18.0, -11.0], [24.0, -11.5], [27.5, -11.7], [28.3, -15.4], [31.0, -17.8], [34.8, -19.8]],
  [[14.5, -22.9], [20.0, -22.0], [25.9, -24.6], [28.0, -26.2], [32.6, -25.9]],
  [[18.4, -33.9], [22.0, -31.0], [26.2, -29.1], [28.0, -26.2], [31.0, -29.9]],
  [[17.1, -22.6], [18.0, -28.0], [21.0, -28.5], [25.6, -33.9]],
  // Madagascar Central Spine
  [[49.0, -13.0], [47.5, -18.9], [46.0, -22.0], [44.5, -24.5]],

  // --- EUROPE INTERNAL DETAIL LINES ---
  // Pyrenees Spine (Spain/France)
  [[-2.0, 43.3], [0.5, 42.8], [3.0, 42.4]],
  // Alps Mountain Arc (France/Switzerland/Italy/Austria)
  [[5.5, 45.0], [7.5, 46.0], [10.0, 46.5], [13.0, 47.0], [15.5, 46.5]],
  // Rhine - Danube Continental Corridor
  [[4.5, 51.5], [7.5, 50.0], [12.0, 48.5], [16.5, 48.0], [19.0, 47.5], [22.0, 45.0], [28.0, 44.5]],
  // Baltic / Carpathian Ridge
  [[18.0, 54.5], [21.0, 52.2], [24.0, 49.0], [26.0, 46.5], [28.0, 45.0]],
  // Apennines (Italy Spine)
  [[9.0, 45.0], [11.5, 44.0], [12.5, 42.0], [14.5, 41.0], [16.0, 39.0]],
  // Scandinavian Mountain Spine
  [[6.0, 60.0], [9.0, 62.0], [13.0, 65.0], [18.0, 68.0], [22.0, 69.0]],
  // Volga River Corridor (Russia)
  [[37.6, 55.7], [44.0, 56.3], [49.1, 55.8], [48.0, 53.0], [48.0, 48.5], [48.0, 46.0]],
  // Ural Mountains Continental Spine (Europe/Asia Divide)
  [[60.0, 68.0], [59.0, 64.0], [59.0, 58.0], [58.0, 54.0], [57.0, 51.0]],
  // Ob River Basin (Siberia)
  [[73.0, 66.0], [69.0, 61.0], [77.0, 61.0], [83.0, 54.0]],
  // Yenisey River Basin (Siberia)
  [[86.0, 70.0], [87.0, 61.0], [92.0, 56.0], [94.0, 51.0]],
  // Lena River Basin (Eastern Siberia)
  [[127.0, 72.0], [124.0, 64.0], [120.0, 60.0], [105.0, 53.0]],
  // Lake Baikal Corridor
  [[103.0, 51.5], [107.0, 53.0], [110.0, 55.5]],

  // --- MIDDLE EAST INTERNAL LINES ---
  // Arabian Peninsula Ridge
  [[36.0, 26.0], [40.0, 24.0], [46.7, 24.7], [50.0, 25.0], [55.3, 25.2]],
  // Tigris - Euphrates Corridor
  [[37.0, 37.0], [41.0, 35.0], [44.4, 33.3], [47.8, 30.5]],
  // Zagros Mountain Spine (Iran)
  [[46.0, 37.0], [49.0, 34.0], [51.5, 32.5], [55.0, 29.0], [59.0, 27.0]],

  // --- SOUTH ASIA (PAKISTAN & INDIA) INTERNAL LINES ---
  // Indus River Basin (Pakistan)
  [[75.0, 35.0], [73.0, 33.7], [71.5, 30.2], [68.4, 25.4], [67.0, 24.9]],
  // Himalayan Mountain Arc
  [[72.0, 35.5], [75.0, 34.5], [78.0, 32.0], [83.0, 29.0], [88.0, 27.5], [93.0, 28.0]],
  // Ganges - Yamuna Corridor
  [[77.2, 28.6], [80.0, 26.5], [83.0, 25.5], [88.4, 22.6]],
  // Western Ghats (India)
  [[73.0, 20.0], [74.0, 15.0], [76.0, 11.0], [77.5, 8.5]],

  // --- EAST ASIA INTERNAL LINES ---
  // Yangtze River Corridor
  [[104.0, 30.5], [109.0, 30.5], [114.3, 30.6], [119.0, 31.5], [121.5, 31.2]],
  // Yellow River Corridor
  [[103.0, 36.0], [110.0, 38.0], [111.0, 34.5], [116.0, 36.0], [119.0, 37.5]],
  // Japan Central Spine
  [[131.0, 32.0], [135.0, 34.5], [139.0, 36.5], [141.0, 39.0], [142.0, 43.0]],

  // --- SOUTH AMERICA INTERNAL LINES ---
  // Andes Mountain Spine
  [[-73.0, 10.0], [-76.0, 4.0], [-78.5, -0.2], [-76.0, -9.0], [-72.0, -15.0], [-69.0, -22.0], [-70.0, -33.0], [-72.0, -42.0], [-72.0, -52.0]],
  // Amazon River Corridor
  [[-75.0, -4.0], [-70.0, -3.5], [-60.0, -3.1], [-54.0, -2.0], [-48.5, -1.4]],
  // Parana / La Plata Corridor
  [[-50.0, -20.0], [-55.0, -25.0], [-59.0, -30.0], [-58.4, -34.6]],

  // --- NORTH AMERICA INTERNAL LINES ---
  // Appalachian Ridge
  [[-84.0, 35.0], [-80.0, 38.0], [-76.0, 41.0], [-72.0, 44.0], [-68.0, 46.0]],
  // Mississippi River Basin
  [[-93.0, 45.0], [-91.0, 41.0], [-90.0, 36.0], [-90.1, 29.9]],
  // Rocky Mountains Spine
  [[-114.0, 32.0], [-111.0, 36.0], [-107.0, 40.0], [-109.0, 44.0], [-114.0, 48.0], [-118.0, 52.0], [-125.0, 58.0]],
  // Great Lakes & St. Lawrence Corridor
  [[-92.0, 47.0], [-87.0, 45.0], [-82.0, 44.0], [-79.0, 43.5], [-76.0, 44.5], [-71.0, 47.0], [-68.0, 48.5]],

  // --- ADDITIONAL SOUTH AMERICA INTERNAL LINES ---
  // Orinoco & Guiana Corridor
  [[-67.0, 6.0], [-64.0, 8.0], [-61.0, 8.5]],
  // Brazilian Highlands Spine
  [[-48.0, -15.0], [-45.0, -18.0], [-44.0, -22.0], [-48.0, -25.0]],
];

// -------------------------------------------------------------
// POINT-IN-POLYGON & INTERNAL WIREFRAME MESH GENERATOR
// Fills continents with dense, intricate, holographic detailing lines
// -------------------------------------------------------------
function isPointInPoly(pt: [number, number], poly: [number, number][]): boolean {
  const x = pt[0];
  const y = pt[1];
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function generateMapSmallLines(): [number, number][][] {
  const lines: [number, number][][] = [];
  const closedPolys = CONTINENT_POLYGONS.filter((p) => {
    if (p.length < 4) return false;
    const first = p[0];
    const last = p[p.length - 1];
    return Math.hypot(first[0] - last[0], first[1] - last[1]) < 0.1;
  });

  const dLat = 2.5;
  const dLon = 2.9;

  closedPolys.forEach((poly) => {
    let minLon = 180;
    let maxLon = -180;
    let minLat = 90;
    let maxLat = -90;

    for (const pt of poly) {
      if (pt[0] < minLon) minLon = pt[0];
      if (pt[0] > maxLon) maxLon = pt[0];
      if (pt[1] < minLat) minLat = pt[1];
      if (pt[1] > maxLat) maxLat = pt[1];
    }

    const interiorPts: [number, number][] = [];
    let rowIdx = 0;
    for (let lat = minLat + dLat * 0.5; lat < maxLat; lat += dLat) {
      const lonOffset = rowIdx % 2 === 1 ? dLon * 0.5 : 0;
      for (let lon = minLon + dLon * 0.5; lon < maxLon; lon += dLon) {
        const pt: [number, number] = [lon + lonOffset, lat];
        if (isPointInPoly(pt, poly)) {
          interiorPts.push(pt);
        }
      }
      rowIdx++;
    }

    // Connect interior points within distance threshold (creates equilateral/isosceles triangular mesh)
    const maxDist = dLon * 1.45;
    const minDist = dLon * 0.30;
    for (let i = 0; i < interiorPts.length; i++) {
      const p1 = interiorPts[i];
      let connections = 0;
      for (let j = i + 1; j < interiorPts.length; j++) {
        const p2 = interiorPts[j];
        const dist = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
        if (dist >= minDist && dist <= maxDist) {
          lines.push([p1, p2]);
          connections++;
          if (connections >= 6) break;
        }
      }

      // Connect to nearest polygon boundary vertices so internal mesh links seamlessly to outline
      for (let k = 0; k < poly.length; k++) {
        const bp = poly[k];
        const bDist = Math.hypot(p1[0] - bp[0], p1[1] - bp[1]);
        if (bDist >= minDist && bDist <= maxDist * 1.15) {
          lines.push([p1, bp]);
          break;
        }
      }
    }
  });

  return lines;
}

const MAP_SMALL_LINES: [number, number][][] = generateMapSmallLines();

// -------------------------------------------------------------
// EXTENSIVE NETWORK NODES (Glowing Circular Dots - ZERO PLUS SIGNS)
// Comprehensive coverage across Top Horizon, Continents & Oceans
// -------------------------------------------------------------
interface NetworkNode {
  id: number;
  lon: number;
  lat: number;
  name: string;
  isMajor?: boolean; // Major hub cities: circular glowing aura + bright white core (NO PLUS SIGNS)
  size: number;
}

const NETWORK_NODES: NetworkNode[] = [
  // --- NORTHERN & ARCTIC (0 - 7) ---
  { id: 0, lon: 15.5, lat: 78.0, name: 'Svalbard', isMajor: true, size: 2.6 },
  { id: 1, lon: 18.9, lat: 69.6, name: 'Tromso', size: 2.0 },
  { id: 2, lon: 33.1, lat: 68.9, name: 'Murmansk', size: 2.0 },
  { id: 3, lon: -21.9, lat: 64.1, name: 'Reykjavik', isMajor: true, size: 2.4 },
  { id: 4, lon: -149.9, lat: 61.2, name: 'Anchorage', isMajor: true, size: 2.4 },
  { id: 5, lon: 88.2, lat: 69.3, name: 'Norilsk', size: 2.0 },
  { id: 6, lon: 129.7, lat: 62.0, name: 'Yakutsk', size: 2.0 },
  { id: 7, lon: -51.7, lat: 64.2, name: 'Nuuk', size: 2.0 },

  // --- AFRICA (8 - 25) ---
  { id: 8, lon: 31.2, lat: 30.0, name: 'Cairo', isMajor: true, size: 3.2 },
  { id: 9, lon: 29.9, lat: 31.2, name: 'Alexandria', size: 2.0 },
  { id: 10, lon: 13.2, lat: 32.9, name: 'Tripoli', size: 2.0 },
  { id: 11, lon: 10.2, lat: 36.8, name: 'Tunis', size: 2.0 },
  { id: 12, lon: 3.0, lat: 36.7, name: 'Algiers', size: 2.0 },
  { id: 13, lon: -7.6, lat: 33.6, name: 'Casablanca', isMajor: true, size: 2.6 },
  { id: 14, lon: -17.4, lat: 14.7, name: 'Dakar', isMajor: true, size: 2.6 },
  { id: 15, lon: 3.4, lat: 6.5, name: 'Lagos', isMajor: true, size: 3.0 },
  { id: 16, lon: 7.5, lat: 9.1, name: 'Abuja', size: 2.0 },
  { id: 17, lon: -0.2, lat: 5.6, name: 'Accra', size: 2.0 },
  { id: 18, lon: 15.3, lat: -4.3, name: 'Kinshasa', isMajor: true, size: 2.6 },
  { id: 19, lon: 38.7, lat: 9.0, name: 'Addis Ababa', size: 2.2 },
  { id: 20, lon: 36.8, lat: -1.3, name: 'Nairobi', isMajor: true, size: 2.8 },
  { id: 21, lon: 39.3, lat: -6.8, name: 'Dar es Salaam', size: 2.0 },
  { id: 22, lon: 13.2, lat: -8.8, name: 'Luanda', size: 2.2 },
  { id: 23, lon: 28.0, lat: -26.2, name: 'Johannesburg', isMajor: true, size: 3.0 },
  { id: 24, lon: 18.4, lat: -33.9, name: 'Cape Town', isMajor: true, size: 2.6 },
  { id: 25, lon: 47.5, lat: -18.9, name: 'Antananarivo', size: 2.0 },

  // --- EUROPE (26 - 42) ---
  { id: 26, lon: -0.1, lat: 51.5, name: 'London', isMajor: true, size: 3.2 },
  { id: 27, lon: -3.2, lat: 55.9, name: 'Edinburgh', size: 2.0 },
  { id: 28, lon: -6.3, lat: 53.3, name: 'Dublin', size: 2.0 },
  { id: 29, lon: 2.3, lat: 48.9, name: 'Paris', isMajor: true, size: 3.0 },
  { id: 30, lon: -3.7, lat: 40.4, name: 'Madrid', isMajor: true, size: 2.6 },
  { id: 31, lon: -9.1, lat: 38.7, name: 'Lisbon', size: 2.2 },
  { id: 32, lon: 12.5, lat: 41.9, name: 'Rome', isMajor: true, size: 2.6 },
  { id: 33, lon: 9.2, lat: 45.5, name: 'Milan', size: 2.2 },
  { id: 34, lon: 8.7, lat: 50.1, name: 'Frankfurt', isMajor: true, size: 2.8 },
  { id: 35, lon: 13.4, lat: 52.5, name: 'Berlin', size: 2.4 },
  { id: 36, lon: 4.9, lat: 52.4, name: 'Amsterdam', size: 2.2 },
  { id: 37, lon: 16.4, lat: 48.2, name: 'Vienna', size: 2.2 },
  { id: 38, lon: 21.0, lat: 52.2, name: 'Warsaw', size: 2.2 },
  { id: 39, lon: 23.7, lat: 38.0, name: 'Athens', size: 2.2 },
  { id: 40, lon: 29.0, lat: 41.0, name: 'Istanbul', isMajor: true, size: 2.8 },
  { id: 41, lon: 18.1, lat: 59.3, name: 'Stockholm', size: 2.2 },
  { id: 42, lon: 37.6, lat: 55.8, name: 'Moscow', isMajor: true, size: 3.0 },

  // --- MIDDLE EAST & CENTRAL / SOUTH ASIA (43 - 55) ---
  { id: 43, lon: 55.3, lat: 25.3, name: 'Dubai', isMajor: true, size: 3.2 },
  { id: 44, lon: 46.7, lat: 24.7, name: 'Riyadh', size: 2.4 },
  { id: 45, lon: 51.5, lat: 25.3, name: 'Doha', size: 2.0 },
  { id: 46, lon: 44.4, lat: 33.3, name: 'Baghdad', size: 2.2 },
  { id: 47, lon: 51.4, lat: 35.7, name: 'Tehran', size: 2.4 },
  { id: 48, lon: 73.0, lat: 33.7, name: 'Islamabad', size: 2.2 },
  { id: 49, lon: 67.0, lat: 24.9, name: 'Karachi', isMajor: true, size: 2.8 },
  { id: 50, lon: 74.3, lat: 31.5, name: 'Lahore', size: 2.2 },
  { id: 51, lon: 77.2, lat: 28.6, name: 'New Delhi', isMajor: true, size: 3.2 },
  { id: 52, lon: 72.8, lat: 19.1, name: 'Mumbai', isMajor: true, size: 3.0 },
  { id: 53, lon: 77.6, lat: 13.0, name: 'Bengaluru', size: 2.4 },
  { id: 54, lon: 90.4, lat: 23.8, name: 'Dhaka', size: 2.2 },
  { id: 55, lon: 79.9, lat: 6.9, name: 'Colombo', size: 2.0 },

  // --- EAST ASIA, SE ASIA & OCEANIA (56 - 69) ---
  { id: 56, lon: 100.5, lat: 13.8, name: 'Bangkok', size: 2.4 },
  { id: 57, lon: 103.8, lat: 1.35, name: 'Singapore', isMajor: true, size: 3.2 },
  { id: 58, lon: 101.7, lat: 3.1, name: 'Kuala Lumpur', size: 2.2 },
  { id: 59, lon: 106.8, lat: -6.2, name: 'Jakarta', size: 2.4 },
  { id: 60, lon: 121.0, lat: 14.6, name: 'Manila', size: 2.2 },
  { id: 61, lon: 114.2, lat: 22.3, name: 'Hong Kong', isMajor: true, size: 3.0 },
  { id: 62, lon: 121.5, lat: 31.2, name: 'Shanghai', isMajor: true, size: 3.2 },
  { id: 63, lon: 116.4, lat: 39.9, name: 'Beijing', isMajor: true, size: 3.2 },
  { id: 64, lon: 127.0, lat: 37.6, name: 'Seoul', isMajor: true, size: 2.8 },
  { id: 65, lon: 139.7, lat: 35.7, name: 'Tokyo', isMajor: true, size: 3.4 },
  { id: 66, lon: 135.5, lat: 34.7, name: 'Osaka', size: 2.4 },
  { id: 67, lon: 151.2, lat: -33.9, name: 'Sydney', isMajor: true, size: 3.0 },
  { id: 68, lon: 144.9, lat: -37.8, name: 'Melbourne', size: 2.4 },
  { id: 69, lon: 174.8, lat: -36.8, name: 'Auckland', size: 2.0 },

  // --- THE AMERICAS (70 - 85) ---
  { id: 70, lon: -74.0, lat: 40.7, name: 'New York', isMajor: true, size: 3.4 },
  { id: 71, lon: -71.1, lat: 42.4, name: 'Boston', size: 2.2 },
  { id: 72, lon: -77.0, lat: 38.9, name: 'Washington DC', size: 2.4 },
  { id: 73, lon: -87.6, lat: 41.9, name: 'Chicago', isMajor: true, size: 2.8 },
  { id: 74, lon: -79.4, lat: 43.7, name: 'Toronto', size: 2.4 },
  { id: 75, lon: -80.2, lat: 25.8, name: 'Miami', isMajor: true, size: 2.6 },
  { id: 76, lon: -118.2, lat: 34.1, name: 'Los Angeles', isMajor: true, size: 3.0 },
  { id: 77, lon: -122.4, lat: 37.8, name: 'San Francisco', isMajor: true, size: 2.8 },
  { id: 78, lon: -99.1, lat: 19.4, name: 'Mexico City', isMajor: true, size: 2.8 },
  { id: 79, lon: -74.1, lat: 4.7, name: 'Bogota', size: 2.2 },
  { id: 80, lon: -77.0, lat: -12.0, name: 'Lima', size: 2.2 },
  { id: 81, lon: -70.7, lat: -33.4, name: 'Santiago', size: 2.2 },
  { id: 82, lon: -58.4, lat: -34.6, name: 'Buenos Aires', isMajor: true, size: 2.8 },
  { id: 83, lon: -46.6, lat: -23.5, name: 'Sao Paulo', isMajor: true, size: 3.2 },
  { id: 84, lon: -43.2, lat: -22.9, name: 'Rio de Janeiro', size: 2.4 },
  { id: 85, lon: -47.9, lat: -15.8, name: 'Brasilia', size: 2.2 },

  // --- OCEANIC RELAYS & ISLAND HUBS (86 - 91) ---
  { id: 86, lon: -25.7, lat: 37.7, name: 'Azores Junction', size: 2.0 },
  { id: 87, lon: -64.8, lat: 32.3, name: 'Bermuda Marine', size: 2.0 },
  { id: 88, lon: -23.5, lat: 14.9, name: 'Cape Verde', size: 2.0 },
  { id: 89, lon: -157.8, lat: 21.3, name: 'Honolulu', isMajor: true, size: 2.4 },
  { id: 90, lon: 178.4, lat: -18.1, name: 'Fiji Marine', size: 1.8 },
  { id: 91, lon: 55.5, lat: -4.7, name: 'Seychelles Hub', size: 1.8 },
];

const ALL_NETWORK_NODES: NetworkNode[] = NETWORK_NODES;

// Curated Short Hyperbolic Communication Arcs (Long-distance transcontinental, low arc height, moving data dots)
interface CommArc {
  from: number;
  to: number;
  arcHeight: number;
}

const GRAND_COMM_ARCS: CommArc[] = [
  // Major Long-Distance Transcontinental & Inter-Oceanic Lines (Low, sleek arc heights: 0.035 to 0.055)
  { from: 26, to: 70, arcHeight: 0.05 },  // London -> New York (Transatlantic)
  { from: 29, to: 70, arcHeight: 0.05 },  // Paris -> New York
  { from: 30, to: 83, arcHeight: 0.055 }, // Madrid -> Sao Paulo (South Atlantic)
  { from: 14, to: 85, arcHeight: 0.045 }, // Dakar -> Brasilia
  { from: 13, to: 23, arcHeight: 0.055 }, // Casablanca -> Johannesburg (Full Africa corridor)
  { from: 26, to: 8, arcHeight: 0.045 },  // London -> Cairo (Europe to Africa)
  { from: 29, to: 43, arcHeight: 0.05 },  // Paris -> Dubai
  { from: 34, to: 42, arcHeight: 0.04 },  // Frankfurt -> Moscow
  { from: 42, to: 63, arcHeight: 0.055 }, // Moscow -> Beijing (Trans-Eurasian)
  { from: 42, to: 65, arcHeight: 0.055 }, // Moscow -> Tokyo
  { from: 8, to: 23, arcHeight: 0.05 },   // Cairo -> Johannesburg
  { from: 8, to: 43, arcHeight: 0.04 },   // Cairo -> Dubai
  { from: 43, to: 52, arcHeight: 0.04 },  // Dubai -> Mumbai
  { from: 48, to: 62, arcHeight: 0.045 }, // Islamabad -> Shanghai
  { from: 52, to: 57, arcHeight: 0.045 }, // Mumbai -> Singapore
  { from: 57, to: 67, arcHeight: 0.055 }, // Singapore -> Sydney (Asia to Australia)
  { from: 63, to: 65, arcHeight: 0.04 },  // Beijing -> Tokyo
  { from: 65, to: 67, arcHeight: 0.055 }, // Tokyo -> Sydney
  { from: 70, to: 75, arcHeight: 0.04 },  // New York -> Miami
  { from: 75, to: 79, arcHeight: 0.045 }, // Miami -> Bogota
  { from: 79, to: 82, arcHeight: 0.05 },  // Bogota -> Buenos Aires
  { from: 80, to: 82, arcHeight: 0.045 }, // Lima -> Buenos Aires
  { from: 70, to: 73, arcHeight: 0.04 },  // New York -> Chicago
  { from: 73, to: 4, arcHeight: 0.05 },   // Chicago -> Anchorage
  { from: 3, to: 26, arcHeight: 0.04 },   // Reykjavik -> London
  { from: 0, to: 8, arcHeight: 0.055 },   // Svalbard -> Cairo
  { from: 2, to: 42, arcHeight: 0.04 },   // Murmansk -> Moscow
  { from: 8, to: 20, arcHeight: 0.045 },  // Cairo -> Nairobi
  { from: 20, to: 23, arcHeight: 0.045 }, // Nairobi -> Johannesburg
  { from: 15, to: 23, arcHeight: 0.05 },  // Lagos -> Johannesburg
  { from: 15, to: 8, arcHeight: 0.045 },  // Lagos -> Cairo
  { from: 51, to: 57, arcHeight: 0.05 },  // New Delhi -> Singapore
  { from: 57, to: 61, arcHeight: 0.04 },  // Singapore -> Hong Kong
  { from: 61, to: 65, arcHeight: 0.045 }, // Hong Kong -> Tokyo
  { from: 41, to: 42, arcHeight: 0.04 },  // Stockholm -> Moscow
  { from: 31, to: 13, arcHeight: 0.04 },  // Lisbon -> Casablanca
  { from: 4, to: 65, arcHeight: 0.055 },  // Anchorage -> Tokyo (North Pacific)
  { from: 73, to: 70, arcHeight: 0.04 },  // Chicago -> New York
  { from: 13, to: 15, arcHeight: 0.05 },  // Casablanca -> Lagos
  { from: 43, to: 20, arcHeight: 0.05 },  // Dubai -> Nairobi
  { from: 77, to: 65, arcHeight: 0.055 }, // San Francisco -> Tokyo
  { from: 89, to: 65, arcHeight: 0.05 },  // Honolulu -> Tokyo
  { from: 76, to: 89, arcHeight: 0.05 },  // Los Angeles -> Honolulu
];

// Coordinate Grid Matrix (Delicate Lat/Lon Matrix Lines)
const LATITUDE_RINGS = [60, 45, 30, 15, 0, -15, -30, -45];
const LONGITUDE_MERIDIANS = [
  -180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150,
];

// Unified 3D Spherical Projection with View Pitch Tilt
function project3D(
  lonDeg: number,
  latDeg: number,
  rotAngle: number,
  cx: number,
  cy: number,
  R: number,
  parX = 0,
  parY = 0,
  altitude = 0
) {
  const rad = Math.PI / 180;
  const lon = lonDeg * rad + rotAngle;
  const lat = latDeg * rad;

  // Viewing tilt: -14 degrees shifts continents and maps prominently onto the topside of the globe
  const pitch = -14 * rad;

  const r = R * (1 + altitude);
  const cosLat = Math.cos(lat);
  const x0 = cosLat * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = cosLat * Math.cos(lon);

  // Pitch rotation around X axis
  const y1 = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
  const z1 = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);

  return {
    x: cx + x0 * r + parX,
    y: cy - y1 * r + parY,
    z: z1, // > 0 means facing the viewer (visible on front hemisphere)
    fade: clamp(z1 / 0.18),
  };
}

interface StarItem {
  nx: number;
  ny: number;
  r: number;
  p: number;
}

interface DataPulse {
  arcIdx: number;
  u: number;
}

interface MeshEdge {
  from: number;
  to: number;
}

export default function HeroGlobeExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSettled, setIsSettled] = useState(false);
  const forceSettleRef = useRef(false);

  const handleSkip = useCallback(() => {
    forceSettleRef.current = true;
    setIsSettled(true);
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      forceSettleRef.current = true;
      setIsSettled(true);
      document.documentElement.classList.remove('intro-active');
      document.body.classList.remove('intro-active');
    } else {
      document.documentElement.classList.add('intro-active');
      document.body.classList.add('intro-active');
    }

    const logoImg = new Image();
    logoImg.src = '/logo.png';

    let W = 0;
    let H = 0;
    let dpr = 1;

    let stars: StarItem[] = [];
    let pulses: DataPulse[] = [];
    let meshEdges: MeshEdge[] = [];
    let airArcs: CommArc[] = [];

    const startTime = performance.now();
    let running = true;
    let animId = 0;
    // Initial rotation (-16°) positions Africa, Europe, and the Mediterranean directly
    // in the front center of the globe, with the Americas on the left and Asia on the right!
    let rot = (-16 * Math.PI) / 180;

    // Mouse tracking for interactive rotation, parallax, and node/line proximity
    let mouseX = -9999;
    let mouseY = -9999;
    let isMouseInHero = false;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isMouseInHero = true;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        const nx = (mouseX - W / 2) / (W / 2);
        const ny = (mouseY - H / 2) / (H / 2);
        targetParallaxX = nx * 14;
        targetParallaxY = ny * 10;
      } else {
        isMouseInHero = false;
        targetParallaxX = 0;
        targetParallaxY = 0;
      }
    };

    const handleMouseLeave = () => {
      isMouseInHero = false;
      mouseX = -9999;
      mouseY = -9999;
      targetParallaxX = 0;
      targetParallaxY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    let initialized = false;

    function setup() {
      if (!canvas) return;
      const heroParent = canvas.parentElement;
      W = heroParent?.clientWidth || canvas.clientWidth || window.innerWidth;
      H = heroParent?.clientHeight || canvas.clientHeight || window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!initialized) {
        initialized = true;
        stars = Array.from({ length: 120 }, () => ({
          nx: Math.random(),
          ny: Math.random() * 0.85,
          r: Math.random() * 1.3 + 0.25,
          p: Math.random() * Math.PI * 2,
        }));

        // -------------------------------------------------------------
        // AUTOMATED GEODESIC TRIANGULAR MESH TOPOLOGY
        // Interconnects each node with its 3-4 nearest spherical neighbours
        // Guarantees continuous mesh coverage across Top Horizon & Globe
        // with ZERO empty patches!
        // -------------------------------------------------------------
        const rad = Math.PI / 180;
        const sphereCoords = ALL_NETWORK_NODES.map((n) => {
          const lon = n.lon * rad;
          const lat = n.lat * rad;
          const cosLat = Math.cos(lat);
          return {
            x: cosLat * Math.sin(lon),
            y: Math.sin(lat),
            z: cosLat * Math.cos(lon),
          };
        });

        const edgeMap = new Set<string>();
        meshEdges = [];

        // DENSE NETWORK MESH: Connects each node with 5-6 neighbours (max dist 0.40)
        // Ensures EVERY node is interconnected and the mesh looks rich and cohesive
        const MAX_EDGE_DIST = 0.58;

        for (let i = 0; i < ALL_NETWORK_NODES.length; i++) {
          const pA = sphereCoords[i];
          const dists: { j: number; d: number }[] = [];

          for (let j = 0; j < ALL_NETWORK_NODES.length; j++) {
            if (i === j) continue;
            const pB = sphereCoords[j];
            const dx = pA.x - pB.x;
            const dy = pA.y - pB.y;
            const dz = pA.z - pB.z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < MAX_EDGE_DIST) {
              dists.push({ j, d });
            }
          }

          dists.sort((a, b) => a.d - b.d);
          // Connect to 5-6 closest neighbours to guarantee a dense, unbroken mesh everywhere
          const kMax = Math.min(4, dists.length);
          const closest = dists.slice(0, kMax);

          for (const nb of closest) {
            const a = Math.min(i, nb.j);
            const b = Math.max(i, nb.j);
            const key = `${a}-${b}`;
            if (!edgeMap.has(key)) {
              edgeMap.add(key);
              meshEdges.push({ from: a, to: b });
            }
          }
        }

        // -------------------------------------------------------------
        // DENSE 3D AIR ARCS (Hyperbolic arches in the air across ALL points of the globe)
        // -------------------------------------------------------------
        const airArcMap = new Set<string>();
        airArcs = [];

        // 1. Curated strategic regional hub arcs
        GRAND_COMM_ARCS.forEach((arc) => {
          const a = Math.min(arc.from, arc.to);
          const b = Math.max(arc.from, arc.to);
          airArcMap.add(`${a}-${b}`);
          airArcs.push(arc);
        });

        // 2. Programmatically generate LONG 3D network lines across the globe with LESS ARC
        for (let i = 0; i < ALL_NETWORK_NODES.length; i += 2) {
          const pA = sphereCoords[i];
          const dists: { j: number; d: number }[] = [];

          for (let j = 0; j < ALL_NETWORK_NODES.length; j++) {
            if (i === j) continue;
            const pB = sphereCoords[j];
            const dx = pA.x - pB.x;
            const dy = pA.y - pB.y;
            const dz = pA.z - pB.z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            // Long network lines spanning continents & oceans: d between 0.50 and 1.30
            if (d >= 0.50 && d <= 1.30) {
              dists.push({ j, d });
            }
          }

          dists.sort((a, b) => a.d - b.d);
          const targets = dists.slice(0, 2);
          for (const nb of targets) {
            const a = Math.min(i, nb.j);
            const b = Math.max(i, nb.j);
            const key = `${a}-${b}`;
            if (!airArcMap.has(key)) {
              airArcMap.add(key);
              // LESS ARC: subtle, sleek atmospheric trajectory (0.035 to 0.055)
              const arcHeight = Math.min(0.055, Math.max(0.035, nb.d * 0.04));
              airArcs.push({ from: a, to: b, arcHeight });
            }
          }
        }
      }
    }

    let transitionTriggered = false;
    let morphStart: { cx: number; cy: number; R: number } | null = null;

    function computeGeometry(t: number) {
      const isMobile = W < 900;

      // Phase 1: Full-screen globe across the full banner
      const R_full = Math.max(W, H) * (isMobile ? 0.78 : 0.85);
      const cx_full = W * 0.5;
      const cy_full = H + R_full * 0.58;

      // Target position: Half-globe emerging from the bottom boundary on the right side
      const cardEl = document.querySelector('.hero-visual');
      let cx_card = isMobile ? W * 0.5 : W * 0.75;
      let R_card = isMobile ? Math.max(W * 0.75, 360) : Math.max(W * 0.38, 560);
      let cy_card = isMobile ? H * 0.82 : H * 0.90;

      if (cardEl && canvas) {
        const heroRect = canvas.getBoundingClientRect();
        const cRect = cardEl.getBoundingClientRect();
        if (cRect.width > 50 && cRect.height > 50) {
          cx_card = cRect.left - heroRect.left + cRect.width / 2;

          R_card = isMobile
            ? Math.max(cRect.width * 0.9, 360)
            : Math.max(cRect.width * 1.15, 560);

          const targetApexY = (cRect.top - heroRect.top) + cRect.height * (isMobile ? 0.36 : 0.38);
          cy_card = targetApexY + R_card;
        }
      }

      if (forceSettleRef.current || prefersReducedMotion) {
        return {
          cx: cx_card,
          cy: cy_card,
          R: R_card,
          lift: 0,
          progress: 1,
          isSettled: true,
        };
      }

      const TRANSITION_START = 4.6;
      const TRANSITION_DURATION = 2.4;
      const TRANSITION_END = TRANSITION_START + TRANSITION_DURATION;

      if (t < TRANSITION_START) {
        const rise = ease(t / 2.0);
        const lift = (1 - rise) * H * 0.45;
        morphStart = { cx: cx_full, cy: cy_full, R: R_full };
        return {
          cx: cx_full,
          cy: cy_full,
          R: R_full,
          lift,
          progress: 0,
          isSettled: false,
        };
      } else if (t >= TRANSITION_START && t < TRANSITION_END) {
        if (!transitionTriggered) {
          transitionTriggered = true;
          document.documentElement.classList.remove('intro-active');
          document.body.classList.remove('intro-active');
        }

        const startGeom = morphStart || { cx: cx_full, cy: cy_full, R: R_full };
        const morphProgress = (t - TRANSITION_START) / TRANSITION_DURATION;
        const eased = easeInOutCubic(morphProgress);
        const cx = startGeom.cx + (cx_card - startGeom.cx) * eased;
        const cy = startGeom.cy + (cy_card - startGeom.cy) * eased;
        const R = startGeom.R + (R_card - startGeom.R) * eased;
        return {
          cx,
          cy,
          R,
          lift: 0,
          progress: eased,
          isSettled: false,
        };
      } else {
        if (!transitionTriggered) {
          transitionTriggered = true;
          document.documentElement.classList.remove('intro-active');
          document.body.classList.remove('intro-active');
        }
        if (!forceSettleRef.current) {
          forceSettleRef.current = true;
          setIsSettled(true);
        }
        return {
          cx: cx_card,
          cy: cy_card,
          R: R_card,
          lift: 0,
          progress: 1,
          isSettled: true,
        };
      }
    }

    function state(t: number, isSettled: boolean) {
      if (isSettled || forceSettleRef.current) {
        return { rise: 1, net: 1, logo: 1, wave: 9999 };
      }
      return {
        rise: ease(t / 2.0),
        net: clamp((t - 1.2) / 2.0),
        logo: ease((t - 2.8) / 1.8),
        wave: Math.max(0, (t - 3.8) / 2.0) * Math.max(W, H) * 1.4,
      };
    }

    function logoBox(
      s: { logo: number },
      t: number,
      cx: number,
      cy: number,
      R: number,
      isSettled: boolean
    ) {
      const isMobile = W < 900;
      const size = isSettled
        ? (isMobile ? 125 : 180)
        : Math.min(R * 0.32, 175);

      const apexY = cy - R;
      const desiredRestY = isSettled
        ? apexY - size - 10
        : apexY - size * 0.88;

      const topSafeMargin = isMobile ? 62 : 76;
      const restY = Math.max(topSafeMargin, desiredRestY);

      const startY = apexY + size * 0.55;
      const float = isSettled ? Math.sin(t * 1.5) * 6 : 0;
      const y = startY + (restY - startY) * s.logo + float;

      return { x: cx - size / 2, y, size, c: { x: cx, y: y + size / 2 } };
    }

    function draw(now: number) {
      if (!running) return;
      const t = (now - startTime) / 1000;

      const activeCanvas = canvas;
      if (!activeCanvas) return;
      const heroParent = activeCanvas.parentElement;
      const curW = heroParent?.clientWidth || activeCanvas.clientWidth || window.innerWidth;
      const curH = heroParent?.clientHeight || activeCanvas.clientHeight || window.innerHeight;
      if (Math.abs(curW - W) > 4 || Math.abs(curH - H) > 4) {
        setup();
      }

      // Smooth mouse parallax lerp
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;

      const geom = computeGeometry(t);
      const s = state(t, geom.isSettled);

      // Subtle rotation speed adjustment on mouse move
      const speedBoost = isMouseInHero ? (currentParallaxX / 14) * 0.0003 : 0;
      rot += (geom.isSettled ? 0.0005 : 0.0004) + speedBoost;

      ctx.clearRect(0, 0, W, H);

      const introFade = clamp(t / 0.6);
      ctx.globalAlpha = introFade;

      ctx.save();
      ctx.translate(0, geom.lift);

      const L = logoBox(s, t, geom.cx, geom.cy, geom.R, geom.isSettled);

      const goldAmt = (p: { x: number; y: number }) => {
        if (s.wave <= 0) return 0;
        const d = Math.hypot(p.x - L.c.x, p.y - L.c.y);
        return clamp((s.wave - d) / 160);
      };

      const rimGold = goldAmt({ x: geom.cx, y: geom.cy - geom.R });
      const rimC = mix(BLUE, GOLD, rimGold * 0.7);

      // 1. Twinkling Stars in background space
      stars.forEach((st) => {
        ctx.fillStyle = `rgba(200, 225, 255, ${
          (0.28 + 0.38 * Math.sin(t * 2 + st.p)) * s.rise
        })`;
        ctx.beginPath();
        ctx.arc(
          st.nx * W + currentParallaxX * 0.2,
          st.ny * H - geom.lift + currentParallaxY * 0.2,
          st.r,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // 2. Soft Atmospheric Nebula Glow behind Earth
      const glowR = Math.min(geom.R * 0.55, Math.max(W, H) * 0.48);
      const glowGrad = ctx.createRadialGradient(
        geom.cx,
        geom.cy - geom.R,
        0,
        geom.cx,
        geom.cy - geom.R,
        glowR
      );
      glowGrad.addColorStop(0, rgba(rimC, 0.30 * s.rise));
      glowGrad.addColorStop(0.35, rgba(rimC, 0.13 * s.rise));
      glowGrad.addColorStop(0.7, rgba(rimC, 0.03 * s.rise));
      glowGrad.addColorStop(1, rgba(rimC, 0));
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(geom.cx, geom.cy - geom.R, glowR, 0, Math.PI * 2);
      ctx.fill();

      // 3. Rising Logo behind Earth (during intro rise only)
      if (!geom.isSettled && s.logo > 0 && s.logo < 0.9) {
        const g = ctx.createRadialGradient(L.c.x, L.c.y, 0, L.c.x, L.c.y, L.size);
        g.addColorStop(0, rgba(GOLD, 0.4 * s.logo));
        g.addColorStop(1, rgba(GOLD, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, L.size, 0, Math.PI * 2);
        ctx.fill();

        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.drawImage(logoImg, L.x, L.y, L.size, L.size);
        }
      }

      // 4. Earth Sphere Body (Deep midnight blue radial base)
      const body = ctx.createRadialGradient(
        geom.cx,
        geom.cy - geom.R * 0.88,
        geom.R * 0.05,
        geom.cx,
        geom.cy,
        geom.R
      );
      body.addColorStop(0, '#0d2866');
      body.addColorStop(0.45, '#06163b');
      body.addColorStop(0.85, '#030a1e');
      body.addColorStop(1, '#020617');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(geom.cx, geom.cy, geom.R, 0, Math.PI * 2);
      ctx.fill();

      // -------------------------------------------------------------
      // 5. WORLD MAP & SURFACE NETWORK (Inside Earth Body Clip)
      // -------------------------------------------------------------
      ctx.save();
      ctx.beginPath();
      ctx.arc(geom.cx, geom.cy, geom.R, 0, Math.PI * 2);
      ctx.clip(); // Strictly confined to Earth globe surface

      // Upper atmosphere haze wash inside top limb (matching reference image)
      const apexHaze = ctx.createRadialGradient(
        geom.cx,
        geom.cy - geom.R,
        0,
        geom.cx,
        geom.cy - geom.R,
        geom.R * 0.65
      );
      apexHaze.addColorStop(0, rgba([100, 200, 255], 0.20 * s.rise));
      apexHaze.addColorStop(0.5, rgba([50, 140, 240], 0.07 * s.rise));
      apexHaze.addColorStop(1, 'rgba(0, 10, 30, 0)');
      ctx.fillStyle = apexHaze;
      ctx.beginPath();
      ctx.arc(geom.cx, geom.cy, geom.R, 0, Math.PI * 2);
      ctx.fill();

      // Project all network nodes in 3D for this frame
      const projectedNodes = ALL_NETWORK_NODES.map((n) =>
        project3D(
          n.lon,
          n.lat,
          rot,
          geom.cx,
          geom.cy,
          geom.R,
          currentParallaxX,
          currentParallaxY
        )
      );

      // Node Mouse Proximity Calculation (Interactive Hover Brightening)
      const hoverRadius = 130;
      const nodeProximities = projectedNodes.map((p) => {
        if (!isMouseInHero || p.z <= 0) return 0;
        const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
        return dist < hoverRadius ? Math.pow(1 - dist / hoverRadius, 1.4) : 0;
      });

      // --- 5A. Planetary Latitude & Longitude Matrix Lines (Subtle light cyber grid) ---
      LATITUDE_RINGS.forEach((latDeg) => {
        ctx.beginPath();
        let started = false;
        for (let lonDeg = -180; lonDeg <= 180; lonDeg += 5) {
          const p = project3D(
            lonDeg,
            latDeg,
            rot,
            geom.cx,
            geom.cy,
            geom.R,
            currentParallaxX,
            currentParallaxY
          );
          if (p.z > 0.04) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = rgba(BLUE, 0.06 * s.rise);
        ctx.lineWidth = 0.45;
        ctx.stroke();
      });

      LONGITUDE_MERIDIANS.forEach((lonDeg) => {
        ctx.beginPath();
        let started = false;
        for (let latDeg = -75; latDeg <= 75; latDeg += 5) {
          const p = project3D(
            lonDeg,
            latDeg,
            rot,
            geom.cx,
            geom.cy,
            geom.R,
            currentParallaxX,
            currentParallaxY
          );
          if (p.z > 0.04) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = rgba(BLUE, 0.06 * s.rise);
        ctx.lineWidth = 0.45;
        ctx.stroke();
      });

      // --- 5B0. DRY AREA LANDMASS LUMINOUS HIGHLIGHT ---
      // Fills continents with a bright, subtle electric cyan wash to highlight dry land
      CONTINENT_POLYGONS.forEach((poly) => {
        let allFront = true;
        for (let i = 0; i < poly.length; i++) {
          const pt = project3D(
            poly[i][0],
            poly[i][1],
            rot,
            geom.cx,
            geom.cy,
            geom.R,
            currentParallaxX,
            currentParallaxY
          );
          if (pt.z <= 0.04) {
            allFront = false;
            break;
          }
        }
        if (allFront) {
          ctx.beginPath();
          for (let i = 0; i < poly.length; i++) {
            const pt = project3D(
              poly[i][0],
              poly[i][1],
              rot,
              geom.cx,
              geom.cy,
              geom.R,
              currentParallaxX,
              currentParallaxY
            );
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
          ctx.fillStyle = rgba(MAP_ELECTRIC, 0.08 * s.rise);
          ctx.fill();
        }
      });

      // --- 5B. CONTINENT WORLD MAP OUTLINES (Bright, luminous vector lines) ---
      CONTINENT_POLYGONS.forEach((poly) => {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < poly.length; i++) {
          const pt = project3D(
            poly[i][0],
            poly[i][1],
            rot,
            geom.cx,
            geom.cy,
            geom.R,
            currentParallaxX,
            currentParallaxY
          );
          if (pt.z > 0.02) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = rgba(MAP_BRIGHT_CYAN, 0.88 * s.rise);
        ctx.lineWidth = 1.35;
        ctx.shadowColor = rgba(MAP_BRIGHT_CYAN, 0.90);
        ctx.shadowBlur = 8;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // --- 5B2. CONTINENT INTERNAL DETAIL LINES (Rivers, Mountain Ridges, Regional Borders) ---
      CONTINENT_INTERNAL_LINES.forEach((line) => {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < line.length; i++) {
          const pt = project3D(
            line[i][0],
            line[i][1],
            rot,
            geom.cx,
            geom.cy,
            geom.R,
            currentParallaxX,
            currentParallaxY
          );
          if (pt.z > 0.02) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = rgba(MAP_BRIGHT_CYAN, 0.52 * s.rise);
        ctx.lineWidth = 0.85;
        ctx.stroke();
      });

      // --- 5B3. CONTINENT INTERNAL WIREFRAME LATTICE (Small delicate detailing lines) ---
      // Fills all continents with intricate high-tech faceted holographic mesh
      ctx.beginPath();
      for (let i = 0; i < MAP_SMALL_LINES.length; i++) {
        const seg = MAP_SMALL_LINES[i];
        const p1 = project3D(
          seg[0][0],
          seg[0][1],
          rot,
          geom.cx,
          geom.cy,
          geom.R,
          currentParallaxX,
          currentParallaxY
        );
        if (p1.z > 0.02) {
          const p2 = project3D(
            seg[1][0],
            seg[1][1],
            rot,
            geom.cx,
            geom.cy,
            geom.R,
            currentParallaxX,
            currentParallaxY
          );
          if (p2.z > 0.02) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = rgba(MAP_BRIGHT_CYAN, 0.40 * s.rise);
      ctx.lineWidth = 0.55;
      ctx.stroke();

      // --- 5C. Extensive Polygonal Mesh Topology (Dense, Light, Low Opacity) ---
      // Covers Top of Globe & Continents with ZERO empty patches!
      meshEdges.forEach((edge) => {
        const p1 = projectedNodes[edge.from];
        const p2 = projectedNodes[edge.to];

        if (p1.z > 0 && p2.z > 0) {
          const lineFade = Math.min(p1.fade, p2.fade) * s.rise;
          if (lineFade <= 0.02) return;

          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const g = goldAmt({ x: mx, y: my });
          const baseColor = mix(BLUE, GOLD, g);

          const prox1 = nodeProximities[edge.from] || 0;
          const prox2 = nodeProximities[edge.to] || 0;
          const maxProx = Math.max(prox1, prox2);

          // Delicate fine mesh lines with reduced opacity as requested
          ctx.strokeStyle = rgba(baseColor, (0.11 + maxProx * 0.18) * lineFade);
          ctx.lineWidth = 0.45 + maxProx * 0.30;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
      ctx.shadowBlur = 0;

      // --- 5D. Network Nodes: Light Points Emitting Radiating Light Beams ---
      projectedNodes.forEach((p, i) => {
        if (p.z <= 0.02) return;
        const node = ALL_NETWORK_NODES[i];
        const nodeFade = p.fade * s.rise;
        if (nodeFade <= 0.02) return;

        const g = goldAmt({ x: p.x, y: p.y });
        const baseColor = mix(MAP_BRIGHT_CYAN, GOLD, g);
        const prox = nodeProximities[i] || 0;
        const nodeColor = prox > 0.2 ? mix(baseColor, [255, 255, 240], prox) : baseColor;

        // Dynamic light breathing pulse for optical beacon effect
        const tPulse = 1 + 0.12 * Math.sin(t * 3.2 + i * 0.55);

        if (node.isMajor) {
          // Major Hubs: Intense light point emitting a wide radiant light beam
          const sz = (node.size * (1 + g * 0.25) + prox * 1.6) * tPulse;
          const lightRadius = sz * 4.6;

          // 1. Soft radiating light emission field (radial gradient)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, lightRadius);
          grad.addColorStop(0, rgba([255, 255, 255], 0.95 * nodeFade));
          grad.addColorStop(0.20, rgba(nodeColor, (0.75 + prox * 0.20) * nodeFade));
          grad.addColorStop(0.55, rgba(nodeColor, (0.24 + prox * 0.15) * nodeFade));
          grad.addColorStop(1, rgba(nodeColor, 0));

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, lightRadius, 0, Math.PI * 2);
          ctx.fill();

          // 2. Glowing circular body
          ctx.fillStyle = rgba(nodeColor, (0.92 + prox * 0.08) * nodeFade);
          ctx.shadowColor = rgba(nodeColor, 1.0);
          ctx.shadowBlur = 12 + prox * 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz * 1.15, 0, Math.PI * 2);
          ctx.fill();

          // 3. Bright incandescent pure white emitter core
          ctx.fillStyle = rgba([255, 255, 255], 1.0 * nodeFade);
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz * 0.65, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Regular Network Node: Radiant light point emitting light
          const sz = (node.size + prox * 1.0) * tPulse;
          const lightRadius = sz * 3.2;

          // Radiating light emission
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, lightRadius);
          grad.addColorStop(0, rgba([255, 255, 255], 0.92 * nodeFade));
          grad.addColorStop(0.35, rgba(nodeColor, (0.55 + prox * 0.20) * nodeFade));
          grad.addColorStop(1, rgba(nodeColor, 0));

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, lightRadius, 0, Math.PI * 2);
          ctx.fill();

          // Bright white center dot
          ctx.fillStyle = rgba([255, 255, 255], 0.98 * nodeFade);
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      ctx.restore(); // End clipping inside Earth body

      // -------------------------------------------------------------
      // 6. LONG 3D NETWORK LINES WITH LOW ARC HEIGHT & MOVING DOTS
      // Spans gracefully across continents and oceans hugging the globe
      // -------------------------------------------------------------
      airArcs.forEach((arc) => {
        const fromNode = ALL_NETWORK_NODES[arc.from];
        const toNode = ALL_NETWORK_NODES[arc.to];
        const p1 = projectedNodes[arc.from];
        const p2 = projectedNodes[arc.to];

        if (p1.z > -0.15 || p2.z > -0.15) {
          let dLon = toNode.lon - fromNode.lon;
          if (dLon > 180) dLon -= 360;
          if (dLon < -180) dLon += 360;

          const steps = 22;
          const arcPts: { x: number; y: number; z: number; fade: number }[] = [];
          const height = arc.arcHeight || 0.045;

          for (let sIdx = 0; sIdx <= steps; sIdx++) {
            const k = sIdx / steps;
            const lonK = fromNode.lon + dLon * k;
            const latK = fromNode.lat + (toNode.lat - fromNode.lat) * k;
            const altK = height * Math.sin(k * Math.PI);
            const pt = project3D(
              lonK,
              latK,
              rot,
              geom.cx,
              geom.cy,
              geom.R,
              currentParallaxX,
              currentParallaxY,
              altK
            );
            arcPts.push(pt);
          }

          const midPt = arcPts[Math.floor(steps / 2)];
          if (midPt.z <= -0.1) return;

          const g = goldAmt({ x: midPt.x, y: midPt.y });
          const baseColor = mix(MAP_BRIGHT_CYAN, GOLD, g);
          const prox1 = nodeProximities[arc.from] || 0;
          const prox2 = nodeProximities[arc.to] || 0;
          const maxProx = Math.max(prox1, prox2);

          ctx.strokeStyle = rgba(
            maxProx > 0.15 ? [255, 235, 140] : baseColor,
            (0.55 + maxProx * 0.25) * s.rise
          );
          ctx.lineWidth = 0.90 + maxProx * 0.4;
          ctx.shadowColor = rgba(baseColor, 0.85);
          ctx.shadowBlur = 5;

          ctx.beginPath();
          let started = false;
          for (let i = 0; i < arcPts.length; i++) {
            const p = arcPts[i];
            if (p.z > -0.08) {
              if (!started) {
                ctx.moveTo(p.x, p.y);
                started = true;
              } else {
                ctx.lineTo(p.x, p.y);
              }
            } else {
              started = false;
            }
          }
          ctx.stroke();

          // Satellite / Relay circular dot perched at the summit in space
          if (midPt.z > 0.04) {
            ctx.fillStyle = rgba([255, 255, 255], 0.90 * s.rise);
            ctx.shadowColor = rgba(baseColor, 1);
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(midPt.x, midPt.y, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.shadowBlur = 0;

      // Continuous Data Pulses travelling along 3D Space Arcs (Moving dots)
      if (s.net > 0.70 && Math.random() < 0.45) {
        if (airArcs.length) {
          pulses.push({
            arcIdx: Math.floor(Math.random() * airArcs.length),
            u: 0,
          });
        }
      }

      pulses = pulses.filter((p) => (p.u += 0.015) < 1);
      pulses.forEach((pulse) => {
        const arc = airArcs[pulse.arcIdx];
        if (!arc) return;
        const fromNode = ALL_NETWORK_NODES[arc.from];
        const toNode = ALL_NETWORK_NODES[arc.to];

        let dLon = toNode.lon - fromNode.lon;
        if (dLon > 180) dLon -= 360;
        if (dLon < -180) dLon += 360;

        const u = pulse.u;
        const lonU = fromNode.lon + dLon * u;
        const latU = fromNode.lat + (toNode.lat - fromNode.lat) * u;
        const altU = (arc.arcHeight || 0.045) * Math.sin(u * Math.PI);
        const pPulse = project3D(
          lonU,
          latU,
          rot,
          geom.cx,
          geom.cy,
          geom.R,
          currentParallaxX,
          currentParallaxY,
          altU
        );

        if (pPulse.z > -0.06) {
          const g = goldAmt({ x: pPulse.x, y: pPulse.y });
          const c = mix([150, 235, 255], GOLD, g);

          // Moving dot: bright glowing halo with pure white core
          ctx.fillStyle = rgba(c, 0.95);
          ctx.shadowColor = rgba(c, 1);
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(pPulse.x, pPulse.y, 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
          ctx.beginPath();
          ctx.arc(pPulse.x, pPulse.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // 7. Luminous Golden Horizon Rim Corona
      // Seamlessly covers from the far left horizon all the way over the apex down the far right side!
      const rimAngle = Math.PI * 0.55;
      const coronaColor = geom.isSettled ? GOLD : mix(BLUE, GOLD, rimGold * 0.7);
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = rgba(coronaColor, (0.55 - i * 0.11) * s.rise);
        ctx.lineWidth = 2.0 + i * 2.8;
        ctx.shadowColor = rgba(coronaColor, 0.9);
        ctx.shadowBlur = 18 + i * 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(
          geom.cx,
          geom.cy,
          geom.R + i * 1.5,
          -Math.PI / 2 - rimAngle,
          -Math.PI / 2 + rimAngle
        );
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.shadowBlur = 0;

      // 8. DCS Logo & Golden Glow in Hero / Settled State
      if (geom.isSettled || s.logo >= 0.9) {
        const g = ctx.createRadialGradient(
          L.c.x,
          L.c.y,
          0,
          L.c.x,
          L.c.y,
          L.size * 0.85
        );
        const glowA =
          0.42 * s.logo * (geom.isSettled ? 0.88 + 0.12 * Math.sin(t * 2) : 1);
        g.addColorStop(0, rgba(GOLD, glowA));
        g.addColorStop(0.5, rgba(GOLD, glowA * 0.35));
        g.addColorStop(1, rgba(GOLD, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, L.size * 0.85, 0, Math.PI * 2);
        ctx.fill();

        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.drawImage(logoImg, L.x, L.y, L.size, L.size);
        }
      }

      // 9. Periodic Gold Ripple expanding from Logo (every ~3s in hero state)
      if (geom.isSettled) {
        const rp = (t % 3) / 3;
        ctx.strokeStyle = rgba(GOLD, 0.40 * (1 - rp));
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, L.size * 0.52 + rp * geom.R * 0.75, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 10. Expanding Energy Wave Ring from Logo during intro
      if (!geom.isSettled && s.wave > 0 && s.wave < Math.max(W, H) * 1.4) {
        ctx.strokeStyle = rgba(GOLD, 0.50 * (1 - s.wave / (Math.max(W, H) * 1.4)));
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, s.wave, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
      ctx.globalAlpha = 1.0;

      if (running) {
        animId = requestAnimationFrame(draw);
      }
    }

    setup();
    window.addEventListener('resize', setup);
    animId = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      document.documentElement.classList.remove('intro-active');
      document.body.classList.remove('intro-active');
      window.removeEventListener('resize', setup);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-globe-layer"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Skip button during cinematic entrance */}
      {!isSettled && (
        <button
          onClick={handleSkip}
          type="button"
          className="hero-skip-intro-btn"
          aria-label="Skip to interactive hero"
        >
          Skip &rarr;
        </button>
      )}
    </div>
  );
}
