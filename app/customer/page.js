"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomerForm from "@/app/components/forms/CustomerForm";

const API_BASE = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api`;

const toId = (id) => (typeof id === "string" ? id : id?.$oid ?? id);

export default function CustomerPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/customer`, { cache: "no-store" });
    const data = await res.json();
    const normalized = (Array.isArray(data) ? data : []).map((d) => ({
      ...d,
      _id: toId(d?._id),
      dobText: d?.dob ? new Date(d.dob).toLocaleDateString() : "",
    }));
    setRows(normalized);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  async function startEdit(id) {
    const res = await fetch(`${API_BASE}/customer/${id}`, { cache: "no-store" });
    if (!res.ok) return;
    const doc = await res.json();
    setEditing({ ...doc, _id: toId(doc._id) });
    setDialogOpen(true);
  }

  async function deleteById(id) {
    if (!confirm("Delete this customer?")) return;
    await fetch(`${API_BASE}/customer/${id}`, { method: "DELETE" });
    loadAll();
  }

  function onSaved() {
    setDialogOpen(false);
    setEditing(null);
    loadAll();
  }
  function onCancel() {
    setDialogOpen(false);
    setEditing(null);
  }

  const columns = useMemo(() => [
    { field: "memberNumber", headerName: "Member #", width: 110, type: "number" },
    { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
    { field: "dobText", headerName: "DOB", width: 140 },
    { field: "interests", headerName: "Interests", flex: 1.2, minWidth: 220 },
    {
      field: "actions", headerName: "Actions", width: 200, sortable: false,
      renderCell: (params) => (
        <div className="flex gap-3">
          <button className="text-blue-600 underline" onClick={() => startEdit(params.row._id)}>Edit</button>
          <button className="text-red-600 underline" onClick={() => deleteById(params.row._id)}>Delete</button>
          <Link href={`/customer/${params.row._id}`} className="text-gray-600 underline">View</Link>
        </div>
      )
    }
  ], []);

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Button variant="contained" onClick={handleAdd}>Add Customer</Button>
      </div>

      <Dialog open={dialogOpen} onClose={onCancel} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent dividers>
          <CustomerForm initialData={editing} onSaved={onSaved} onCancel={onCancel} />
        </DialogContent>
      </Dialog>

      <DataGrid
        autoHeight
        rows={rows}
        getRowId={(r) => r._id}
        columns={columns}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: "memberNumber", sort: "asc" }, { field: "name", sort: "asc" }] },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </main>
  );
}
