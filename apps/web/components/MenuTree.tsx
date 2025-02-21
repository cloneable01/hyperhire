"use client";

import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}

interface MenuTreeProps {
  items: MenuItem[];
  level?: number;
  onAddChild?: (parentId: string) => void;
  onEditItem?: (item: MenuItem) => void;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
  selectedItemId?: string;
}

export function MenuTree({
  items,
  level = 0,
  onAddChild,
  onEditItem,
  expandedItems,
  onToggleExpand,
  onSelectItem,
  selectedItemId,
}: MenuTreeProps) {
  const dispatch = useAppDispatch();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleItemClick = (item: MenuItem) => {
    if (expandedItems.has(item.id)) {
      onToggleExpand(item.id);
    } else {
      onToggleExpand(item.id);
    }
    onSelectItem(item);
  };

  const renderItem = (item: MenuItem, level: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItemId === item.id;
    const isHovered = hoveredId === item.id;

    return (
      <div key={item.id} className="relative">
        <div
          className={`flex items-center pl-${level * 4} relative group ${
            isSelected ? "bg-blue-50" : ""
          }`}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 z-10">
              <div className="border-l border-gray-300 h-full ml-3"></div>
            </div>
          )}

          <div
            className="flex items-center gap-2 min-w-[200px] py-2 px-2 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) onToggleExpand(item.id);
              }}
              className="w-4 h-4 flex items-center justify-center bg-black z-20 rounded"
            >
              {hasChildren && (
                <Image
                  src="/submenu.png"
                  alt="submenu"
                  width={16}
                  height={16}
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>
            <span className="text-sm flex-1">{item.name}</span>

            {isHovered && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditItem?.(item);
                  }}
                  className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center"
                >
                  <Pencil className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChild?.(item.id);
                  }}
                  className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {isExpanded && item.children && (
          <div className="ml-4">
            {item.children.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {items.map((item) => renderItem(item, level))}
    </div>
  );
}
