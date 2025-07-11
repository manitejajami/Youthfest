import React, { useEffect, useState } from "react";

function CollegesTab({ adminSecret }) {
  const [colleges, setColleges] = useState([]);
  const [newCollege, setNewCollege] = useState("");
  useEffect(() => { fetchColleges(); }, []);
  const fetchColleges = async () => {
    const res = await fetch("/api/college", { headers: { "x-admin-secret": adminSecret } });
    setColleges(await res.json());
  };
  const addCollege = async () => {
    if (!newCollege.trim()) return;
    await fetch("/api/college", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ name: newCollege })
    });
    setNewCollege("");
    fetchColleges();
  };
  const deleteCollege = async id => {
    await fetch(`/api/college/${id}`, { method: "DELETE", headers: { "x-admin-secret": adminSecret } });
    fetchColleges();
  };
  return (
    <div>
      <h3>Colleges</h3>
      <input value={newCollege} onChange={e => setNewCollege(e.target.value)} placeholder="Add college" />
      <button onClick={addCollege}>Add</button>
      <ul>
        {colleges.map(c => <li key={c._id}>{c.name} <button onClick={() => deleteCollege(c._id)}>Delete</button></li>)}
      </ul>
    </div>
  );
}

function StatsTab({ adminSecret }) {
  const [stats, setStats] = useState({ total: 0, perCollege: [] });
  useEffect(() => {
    fetch("/api/admin/stats", { headers: { "x-admin-secret": adminSecret } })
      .then(r => r.json())
      .then(setStats);
  }, [adminSecret]);
  return (
    <div>
      <h3>Stats</h3>
      <p>Total registrations: {stats.total}</p>
      <table border="1" cellPadding="4">
        <thead><tr><th>College</th><th>Count</th></tr></thead>
        <tbody>{stats.perCollege.map(s => <tr key={s._id}><td>{s._id}</td><td>{s.count}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function RegistrationsTab({ adminSecret }) {
  const [data, setData] = useState([]);
  const [collegeFilter, setCollegeFilter] = useState("");
  useEffect(() => { fetchData(); }, [collegeFilter]);
  const fetchData = async () => {
    const url = "/api/admin/registrations" + (collegeFilter ? `?college=${encodeURIComponent(collegeFilter)}` : "");
    const res = await fetch(url, { headers: { "x-admin-secret": adminSecret } });
    setData(await res.json());
  };
  const handleDelete = async (id) => {
    await fetch(`/api/admin/registrations/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": adminSecret }
    });
    fetchData();
  };
  const handleExport = async () => {
    const res = await fetch("/api/admin/registrations/export/csv", {
      headers: { "x-admin-secret": adminSecret }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
  };
  return (
    <div>
      <h3>Registrations</h3>
      <input value={collegeFilter} onChange={e => setCollegeFilter(e.target.value)} placeholder="Filter by college" />
      <button onClick={fetchData}>Refresh</button>
      <button onClick={handleExport} style={{ marginLeft: 10 }}>Export CSV</button>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: 15, width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th><th>Gender</th><th>College</th><th>Course</th>
            <th>Year</th><th>DOB</th><th>Reg Date</th><th>WhatsApp</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.gender}</td>
              <td>{r.college}</td>
              <td>{r.course}</td>
              <td>{r.year}</td>
              <td>{r.dob}</td>
              <td>{r.registrationDate}</td>
              <td>{r.whatsapp}</td>
              <td>
                <button onClick={() => handleDelete(r._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPanel() {
  const [adminSecret, setAdminSecret] = useState(sessionStorage.getItem("adminSecret") || "");
  const [tab, setTab] = useState("registrations");

  if (!adminSecret) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin secret"
          value={adminSecret}
          onChange={e => setAdminSecret(e.target.value)}
        />
        <button onClick={() => { sessionStorage.setItem("adminSecret", adminSecret); }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto" }}>
      <div>
        <button onClick={() => setTab("registrations")}>Registrations</button>
        <button onClick={() => setTab("colleges")}>Colleges</button>
        <button onClick={() => setTab("stats")}>Stats</button>
      </div>
      {tab === "registrations" && <RegistrationsTab adminSecret={adminSecret} />}
      {tab === "colleges" && <CollegesTab adminSecret={adminSecret} />}
      {tab === "stats" && <StatsTab adminSecret={adminSecret} />}
    </div>
  );
}