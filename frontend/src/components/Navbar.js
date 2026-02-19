import React from 'react';

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: '#333',
        padding: '10px 20px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: 0, marginRight: 20 }}>TaskKernel</h2>
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            margin: 0,
            padding: 0,
            gap: '14px',
            color: 'white',
          }}
        >
          <li>Dashboard / Home</li>
          <li>Tasks / To-Do List</li>
          <li>Progress / Stats</li>
          <li>Profile / Settings</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
