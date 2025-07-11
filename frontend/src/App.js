import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import AdminPanel from "./AdminPanel";

const useStyles = createUseStyles({
  form: { maxWidth: 400, margin: "20px auto", padding: 20, border: "1px solid #eee", borderRadius: 8, background: "#fafafa" },
  field: { display: "block", marginBottom: 12, width: "100%" },
  label: { fontWeight: "bold" },
  button: { marginTop: 16, padding: "10px 20px", background: "#007bff", color: "#fff", border: 0, borderRadius: 4 },
  suggestionBox: { position: "relative" },
  suggestionList: { 
    position: "absolute", zIndex: 99, background: "#fff", border: "1px solid #ccc", width: "100%", boxSizing: "border-box", margin: 0, padding: 0, listStyle: "none"
  },
  suggestionItem: { padding: "4px 8px", cursor: "pointer", borderBottom: "1px solid #eee" },
});

const RAZORPAY_KEY_ID = "your-razorpay-key-id"; // Set via env or Vercel secret in prod

function App() {
  const classes = useStyles();
  const [form, setForm] = useState({
    name: "", gender: "", college: "", course: "",
    year: "", dob: "", registrationDate: "", whatsapp: "",
  });
  const [status, setStatus] = useState("");
  const [admin, setAdmin] = useState(false);

  // College suggestions
  const [collegeInput, setCollegeInput] = useState("");
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);

  useEffect(() => {
    if (collegeInput.length >= 1) {
      fetch(`/api/college?q=${encodeURIComponent(collegeInput)}`)
        .then(r => r.json())
        .then(setCollegeSuggestions);
    } else {
      setCollegeSuggestions([]);
    }
  }, [collegeInput]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("Redirecting to payment...");
    const orderRes = await fetch("/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name }),
    });
    const order = await orderRes.json();
    if (!order.id) return setStatus("Payment order creation failed");

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Event Registration",
      description: "Registration Fee",
      order_id: order.id,
      handler: async function (response) {
        setStatus("Verifying payment...");
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            registration: form,
          }),
        });
        const verifyData = await verifyRes.json();
        setStatus(verifyData.message || verifyData.error);
      },
      prefill: {
        name: form.name,
        contact: form.whatsapp,
      },
      notes: {
        college: form.college,
        course: form.course,
        year: form.year,
      },
      theme: { color: "#007bff" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <button onClick={() => setAdmin(a => !a)} style={{margin:"12px", position:"absolute", right: 0, top: 0}}>{admin ? "Back to Registration" : "Admin Panel"}</button>
      {!admin ? (
        <form className={classes.form} onSubmit={handleSubmit}>
          <div>
            <label className={classes.label}>Name:</label>
            <input className={classes.field} name="name" required onChange={handleChange} />
          </div>
          <div>
            <label className={classes.label}>Gender:</label>
            <input className={classes.field} name="gender" required onChange={handleChange} />
          </div>
          <div className={classes.suggestionBox}>
            <label className={classes.label}>College:</label>
            <input
              className={classes.field}
              name="college"
              value={collegeInput}
              onChange={e => {
                setCollegeInput(e.target.value);
                setForm({ ...form, college: e.target.value });
              }}
              autoComplete="off"
              required
            />
            {collegeSuggestions.length > 0 && (
              <ul className={classes.suggestionList}>
                {collegeSuggestions.map(c => (
                  <li
                    key={c._id}
                    className={classes.suggestionItem}
                    onClick={() => {
                      setCollegeInput(c.name);
                      setForm({ ...form, college: c.name });
                      setCollegeSuggestions([]);
                    }}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className={classes.label}>Course:</label>
            <input className={classes.field} name="course" required onChange={handleChange} />
          </div>
          <div>
            <label className={classes.label}>Year:</label>
            <input className={classes.field} name="year" required onChange={handleChange} />
          </div>
          <div>
            <label className={classes.label}>DOB:</label>
            <input className={classes.field} name="dob" type="date" required onChange={handleChange} />
          </div>
          <div>
            <label className={classes.label}>Date of Registration:</label>
            <input className={classes.field} name="registrationDate" type="date" required onChange={handleChange} />
          </div>
          <div>
            <label className={classes.label}>WhatsApp No. (+countrycode...):</label>
            <input className={classes.field} name="whatsapp" required onChange={handleChange} />
          </div>
          <button className={classes.button} type="submit">Pay & Register (₹49)</button>
          <div style={{ marginTop: 18 }}>{status}</div>
        </form>
      ) : (
        <AdminPanel />
      )}
    </>
  );
}

export default App;