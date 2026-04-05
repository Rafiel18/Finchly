import React, { useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Debts({ d, save }) {
  const t = useTheme();

  const [form, setForm] = useState({
    description: "",
    creditor: "",
    installmentValue: "",
    totalInstallments: "",
    remainingInstallments: "",
    dueDay: "",
  });

  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const debts = Array.isArray(d?.debts) ? d.debts : [];

  const totalPending = debts.reduce((sum, dbt) => {
    return sum + Number(dbt.installmentValue || 0) * Number(dbt.remainingInstallments || 0);
  }, 0);

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      description: "",
      creditor: "",
      installmentValue: "",
      totalInstallments: "",
      remainingInstallments: "",
      dueDay: "",
    });
  };

  const addDebt = () => {
    const description = form.description.trim();
    const creditor = form.creditor.trim();
    const installmentValue = Number(form.installmentValue);
    const totalInstallments = Number(form.totalInstallments);
    const remainingInstallments = Number(form.remainingInstallments);
    const dueDay = Number(form.dueDay);

    if (!description) return;
    if (!installmentValue || installmentValue <= 0) return;
    if (!totalInstallments || totalInstallments <= 0) return;
    if (
      Number.isNaN(remainingInstallments) ||
      remainingInstallments < 0 ||
      remainingInstallments > totalInstallments
    ) {
      return;
    }
    if (Number.isNaN(dueDay) || dueDay < 1 || dueDay > 31) return;

    const newDebt = {
      id: String(Date.now()),
      description,
      creditor,
      installmentValue,
      totalInstallments,
      remainingInstallments,
      dueDay,
      createdAt: new Date().toISOString(),
    };

    save({
      debts: [newDebt, ...debts],
    });

    resetForm();
  };