"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_BASE = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api`;

export default function CustomerForm({
  initialData = null,
  onSaved = () => {},
  onCancel = () => {},
}) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      _id: "",
      name: "",
      dob: "",           // yyyy-MM-dd
      memberNumber: 1,
      interests: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      // normalize date -> yyyy-MM-dd for <input type="date">
      const iso = initialData.dob ? new Date(initialData.dob).toISOString().slice(0, 10) : "";
      reset({
        _id: initialData._id || "",
        name: initialData.name ?? "",
        dob: iso,
        memberNumber: initialData.memberNumber ?? 1,
        interests: initialData.interests ?? "",
      });
    } else {
      reset({ _id: "", name: "", dob: "", memberNumber: 1, interests: "" });
    }
  }, [initialData, reset]);

  async function onCreate(data) {
    const payload = {
      name: data.name,
      dob: data.dob ? new Date(data.dob).toISOString() : null,
      memberNumber: Number(data.memberNumber ?? 1),
      interests: data.interests,
    };
    const res = await fetch(`${API_BASE}/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Create failed");
    onSaved(await res.json());
  }

  async function onUpdate(data) {
    const payload = {
      _id: data._id || initialData?._id,
      name: data.name,
      dob: data.dob ? new Date(data.dob).toISOString() : null,
      memberNumber: Number(data.memberNumber ?? 1),
      interests: data.interests,
    };
    const res = await fetch(`${API_BASE}/customer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Update failed");
    onSaved(await res.json());
  }

  const isEdit = Boolean(initialData?._id);

  return (
    <form onSubmit={handleSubmit(isEdit ? onUpdate : onCreate)}>
      <Stack spacing={2} sx={{ minWidth: 420 }}>
        {isEdit && <input type="hidden" {...register("_id")} />}
        <TextField label="Name" size="small" fullWidth {...register("name", { required: true })} />
        <TextField label="Date of Birth" size="small" fullWidth type="date" InputLabelProps={{ shrink: true }} {...register("dob")} />
        <TextField label="Member Number" size="small" fullWidth type="number" inputProps={{ min: 1, step: 1 }} {...register("memberNumber", { valueAsNumber: true })} />
        <TextField label="Interests" size="small" fullWidth placeholder="movies, football, gym, gaming" {...register("interests")} />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onCancel} type="button" color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>{isEdit ? "Update" : "Add"}</Button>
        </Stack>
      </Stack>
    </form>
  );
}
