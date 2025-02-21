import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface MenuItem {
  id: string;
  name: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedItem: MenuItem | null;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
};

export const fetchMenus = createAsyncThunk("menu/fetchMenus", async () => {
  const response = await fetch(`${API_URL}/menus`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch menus");
  return response.json();
});

export const createMenuItem = createAsyncThunk(
  "menu/createMenuItem",
  async (data: { name: string; parentId?: string; order?: number }) => {
    const response = await fetch(`${API_URL}/menus`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create menu item");
    return response.json();
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, data }: { id: string; data: Partial<MenuItem> }) => {
    const response = await fetch(`${API_URL}/menus/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update menu item");
    return response.json();
  }
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id: string) => {
    const response = await fetch(`${API_URL}/menus/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to delete menu item");
    return id;
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch menus";
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.parentId) {
          state.items.push(action.payload);
        } else {
          const addToChildren = (items: MenuItem[]) => {
            for (const item of items) {
              if (item.id === action.payload.parentId) {
                item.children = item.children || [];
                item.children.push(action.payload);
                return true;
              }
              if (item.children && addToChildren(item.children)) {
                return true;
              }
            }
            return false;
          };
          addToChildren(state.items);
        }
      });
  },
});

export const { setSelectedItem } = menuSlice.actions;
export default menuSlice.reducer;
