"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { updateMenuItem } from "../store/features/menuSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  name: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}

interface DetailFormProps {
  selectedItem: MenuItem | null;
  parentData?: string;
}

export function DetailForm({ selectedItem, parentData }: DetailFormProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    depth: "",
    parentData: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        depth: "3",
        parentData: parentData || "",
      });
    }
  }, [selectedItem, parentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    await dispatch(
      updateMenuItem({
        id: selectedItem.id,
        data: {
          name: formData.name,
        },
      })
    );
  };

  if (!selectedItem) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
        Select a menu item to view details
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-sm"
    >
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-700">Menu ID</Label>
        <Input
          value={selectedItem.id}
          readOnly
          className="bg-gray-100 border border-gray-300 text-gray-600 h-9 rounded-md"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-700">Depth</Label>
        <Input
          value={formData.depth}
          readOnly
          className="bg-gray-100 border border-gray-300 text-gray-600 h-9 rounded-md"
        />
      </div>
      {parentData && (
        <div>
          <Label>Parent ID</Label>
          <Input value={parentData} readOnly />
        </div>
      )}
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-700">Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-9 rounded-md"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        Save
      </Button>
    </form>
  );
}
