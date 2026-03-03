// ─── In-memory data ──────────────────────────────────────────────────────────

const rooms = [
  {
    id: 'a-301', name: 'A.301', building: 'A', floor: 3, capacity: 20,
    equipment: ['WiFi', 'Projector', 'Whiteboard', 'AC'],
    image: 'https://picsum.photos/seed/a301/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '09:00', endTime: '11:00' },
      { date: '2026-03-04', startTime: '14:00', endTime: '16:00' },
    ],
  },
  {
    id: 'a-302', name: 'A.302', building: 'A', floor: 3, capacity: 12,
    equipment: ['WiFi', 'Whiteboard'],
    image: 'https://picsum.photos/seed/a302/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '13:00', endTime: '15:00' },
    ],
  },
  {
    id: 'a-401', name: 'A.401', building: 'A', floor: 4, capacity: 8,
    equipment: ['WiFi', 'AC'],
    image: 'https://picsum.photos/seed/a401/400/240',
    bookings: [],
  },
  {
    id: 'a-402', name: 'A.402', building: 'A', floor: 4, capacity: 30,
    equipment: ['WiFi', 'Projector', 'AC', 'Audio System'],
    image: 'https://picsum.photos/seed/a402/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '10:00', endTime: '12:00' },
    ],
  },
  {
    id: 'a-501', name: 'A.501', building: 'A', floor: 5, capacity: 16,
    equipment: ['WiFi', 'Projector', 'Whiteboard'],
    image: 'https://picsum.photos/seed/a501/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '09:00', endTime: '11:00' },
    ],
  },
  {
    id: 'b1-101', name: 'B1.101', building: 'B1', floor: 1, capacity: 10,
    equipment: ['WiFi', 'AC'],
    image: 'https://picsum.photos/seed/b1101/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '09:00', endTime: '12:00' },
    ],
  },
  {
    id: 'b1-102', name: 'B1.102', building: 'B1', floor: 1, capacity: 6,
    equipment: ['WiFi', 'Whiteboard'],
    image: 'https://picsum.photos/seed/b1102/400/240',
    bookings: [],
  },
  {
    id: 'b1-201', name: 'B1.201', building: 'B1', floor: 2, capacity: 24,
    equipment: ['WiFi', 'Projector', 'AC', 'Audio System'],
    image: 'https://picsum.photos/seed/b1201/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '15:00', endTime: '17:00' },
    ],
  },
  {
    id: 'b1-202', name: 'B1.202', building: 'B1', floor: 2, capacity: 4,
    equipment: ['WiFi'],
    image: 'https://picsum.photos/seed/b1202/400/240',
    bookings: [],
  },
  {
    id: 'b1-301', name: 'B1.301', building: 'B1', floor: 3, capacity: 18,
    equipment: ['WiFi', 'Projector', 'Whiteboard', 'AC'],
    image: 'https://picsum.photos/seed/b1301/400/240',
    bookings: [
      { date: '2026-03-04', startTime: '11:00', endTime: '13:00' },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns true if the requested slot overlaps any existing booking on that date.
 * Overlap rule: newStart < existingEnd AND newEnd > existingStart
 */
function isRoomAvailable(room, date, startTime, endTime) {
  return !room.bookings.some(
    (b) =>
      b.date === date &&
      startTime < b.endTime &&
      endTime > b.startTime
  );
}

// ─── Controllers ─────────────────────────────────────────────────────────────

const getRooms = (req, res) => {
  const { building, floor, capacityMin, search, date, startTime, endTime } = req.query;

  let result = rooms.map((r) => {
    // Compute dynamic availability if date+time provided
    let status = 'AVAILABLE';
    if (date && startTime && endTime) {
      status = isRoomAvailable(r, date, startTime, endTime) ? 'AVAILABLE' : 'BOOKED';
    }
    // Strip internal bookings array from response
    const { bookings, ...rest } = r;
    return { ...rest, status };
  });

  if (building) {
    result = result.filter((r) => r.building === building);
  }

  if (floor) {
    const floorNum = parseInt(floor, 10);
    if (!isNaN(floorNum)) result = result.filter((r) => r.floor === floorNum);
  }

  if (capacityMin) {
    const minCap = parseInt(capacityMin, 10);
    if (!isNaN(minCap)) result = result.filter((r) => r.capacity >= minCap);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((r) => r.name.toLowerCase().includes(q));
  }

  res.json(result);
};

const bookRoom = (req, res) => {
  const { roomId, date, startTime, endTime } = req.body;

  if (!roomId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'roomId, date, startTime and endTime are required.' });
  }

  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ message: 'Room not found.' });
  }

  if (!isRoomAvailable(room, date, startTime, endTime)) {
    return res.status(400).json({ message: 'Room is not available for the requested time slot.' });
  }

  room.bookings.push({ date, startTime, endTime });
  res.status(201).json({ message: 'Booking confirmed.', booking: { roomId, date, startTime, endTime } });
};

module.exports = { getRooms, bookRoom };


function randomSubset(arr, seed) {
  const count = 1 + (seed % (arr.length));
  const shuffled = [...arr].sort(() => (seed * 0.1) % 1 - 0.3);
  return shuffled.slice(0, count);
}

function generateRooms() {
  const rooms = [];
  let seedCounter = 1;

  // Tòa A: floors 3–8, 12 rooms/floor
  for (let floor = 3; floor <= 8; floor++) {
    for (let room = 1; room <= 12; room++) {
      const roomNum = String(room).padStart(2, '0');
      const name = `A.${floor}${roomNum}`;
      const id = `a-${floor}${roomNum}`;
      const capacity = 4 + (seedCounter * 7 % 27);
      const equipment = randomSubset(EQUIPMENT_LIST, seedCounter);
      const status = seedCounter % 10 < 7 ? 'AVAILABLE' : 'BOOKED';
      const image = `https://picsum.photos/seed/${id}/400/240`;

      rooms.push({ id, name, building: 'A', floor, capacity, equipment, status, image });
      seedCounter++;
    }
  }

  // Tòa B1: floors 1–5, 6 rooms/floor
  for (let floor = 1; floor <= 5; floor++) {
    for (let room = 1; room <= 6; room++) {
      const roomNum = String(room).padStart(2, '0');
      const name = `B1.${floor}${roomNum}`;
      const id = `b1-${floor}${roomNum}`;
      const capacity = 4 + (seedCounter * 7 % 27);
      const equipment = randomSubset(EQUIPMENT_LIST, seedCounter);
      const status = seedCounter % 10 < 7 ? 'AVAILABLE' : 'BOOKED';
      const image = `https://picsum.photos/seed/${id}/400/240`;

      rooms.push({ id, name, building: 'B1', floor, capacity, equipment, status, image });
      seedCounter++;
    }
  }

  return rooms;
}

const ALL_ROOMS = generateRooms();

const getRooms = (req, res) => {
  const { building, floor, capacityMin, search } = req.query;

  let filtered = [...ALL_ROOMS];

  if (building) {
    filtered = filtered.filter(r => r.building === building);
  }

  if (floor) {
    const floorNum = parseInt(floor, 10);
    if (!isNaN(floorNum)) {
      filtered = filtered.filter(r => r.floor === floorNum);
    }
  }

  if (capacityMin) {
    const minCap = parseInt(capacityMin, 10);
    if (!isNaN(minCap)) {
      filtered = filtered.filter(r => r.capacity >= minCap);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => r.name.toLowerCase().includes(q));
  }

  res.json(filtered);
};

module.exports = { getRooms };
