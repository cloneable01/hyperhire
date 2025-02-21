"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMenus, createMenuItem } from "../store/features/menuSlice";
import { MenuTree } from "../components/MenuTree";
import { DetailForm } from "../components/DetailForm";
import Image from "next/image";
import { Select } from "@radix-ui/react-select";
import { updateMenuItem } from "../store/features/menuSlice";

interface MenuItem {
  id: string;
  name: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state: any) => state.menu);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [menuName, setMenuName] = useState(selectedItem?.name);

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const handleAddNew = async (parentId?: string) => {
    if (newItemName.trim()) {
      await dispatch(
        createMenuItem({
          name: newItemName,
          parentId,
          order: items.length,
        })
      );
      setNewItemName("");
      setIsAdding(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const addIds = (items: MenuItem[]) => {
      items.forEach((item) => {
        allIds.add(item.id);
        if (item.children) addIds(item.children);
      });
    };
    addIds(items);
    setExpandedItems(allIds);
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const handleSave = async () => {
    if (!selectedItem) return;

    await dispatch(
      updateMenuItem({
        id: selectedItem.id,
        data: { name: menuName },
      })
    );

    // Refetch the updated menu data
    await dispatch(fetchMenus());
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setMenuName(item.name);
  };

  const handleAddChild = (parentId: string) => {
    setIsAdding(true);
    setSelectedItem({
      id: "",
      name: "",
      parentId,
      order: 0,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-2 p-4 text-gray-500 text-sm">
        <span>/</span>
        <span>Menus</span>
      </div>

      <div className="flex">
        <div className="w-2/3 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image
                src="/submenu.png"
                alt="Menu"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <h1 className="text-2xl">Menus</h1>
          </div>
          <div className="mb-4">
            <select
              value="system management"
              className="w-full p-2 border rounded-md bg-white"
            >
              <option>system management</option>
            </select>
          </div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 border border-gray-200 rounded-md text-sm"
            >
              Collapse All
            </button>
          </div>
          <MenuTree
            items={items}
            expandedItems={expandedItems}
            onToggleExpand={toggleExpand}
            onSelectItem={setSelectedItem}
            onEditItem={handleEditItem}
            onAddChild={handleAddChild}
            selectedItemId={selectedItem?.id}
          />
        </div>
        <div className="w-1/3 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Menu ID</label>
              <input
                type="text"
                value={selectedItem?.id || ""}
                readOnly
                className="w-full p-3 bg-gray-50 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Depth</label>
              <input
                type="text"
                value={selectedItem?.order || ""}
                readOnly
                className="w-full p-3 bg-gray-50 rounded-md outline-none"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Parent Data</label>
              <input
                type="text"
                value={selectedItem?.parentId || ""}
                readOnly
                className="w-full p-3 bg-gray-50 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Name</label>
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-md outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
