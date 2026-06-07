import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit2, Trash2, MapPin, Check } from "lucide-react";
import {
  fetchAddresses,
  addAddress,
  updateAddressApi,
  deleteAddressApi,
} from "../redux/slices/addressSlice";
import { toast } from "react-toastify";

export default function AddressManagementPage() {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const resetForm = () => {
    setName("");
    setMobileNumber("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setStateName("");
    setPostalCode("");
    setIsDefault(false);
    setEditingAddressId(null);
    setFormOpen(false);
  };

  const handleEdit = (addr) => {
    setEditingAddressId(addr._id);
    setName(addr.name);
    setMobileNumber(addr.mobilenumber);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || "");
    setCity(addr.city);
    setStateName(addr.state);
    setPostalCode(addr.postalCode);
    setIsDefault(addr.isDefault);
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !mobilenumber || !addressLine1 || !city || !stateName || !postalCode) {
      toast.error("❌ Please fill in all required fields.");
      return;
    }

    const payload = {
      name,
      mobilenumber,
      addressLine1,
      addressLine2,
      city,
      state: stateName,
      postalCode,
      isDefault,
    };

    let resultAction;
    if (editingAddressId) {
      resultAction = await dispatch(
        updateAddressApi({ addressId: editingAddressId, addressData: payload })
      );
    } else {
      resultAction = await dispatch(addAddress(payload));
    }

    if (
      addAddress.fulfilled.match(resultAction) ||
      updateAddressApi.fulfilled.match(resultAction)
    ) {
      toast.success(editingAddressId ? "✅ Address updated!" : "✅ Address added!");
      resetForm();
    } else {
      toast.error(resultAction.payload || "❌ Operation failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    const resultAction = await dispatch(deleteAddressApi(id));
    if (deleteAddressApi.fulfilled.match(resultAction)) {
      toast.success("✅ Address deleted successfully!");
    } else {
      toast.error(resultAction.payload || "❌ Failed to delete address");
    }
  };

  const handleSetDefault = async (addr) => {
    if (addr.isDefault) return;
    const resultAction = await dispatch(
      updateAddressApi({ addressId: addr._id, addressData: { ...addr, state: addr.state, isDefault: true } })
    );
    if (updateAddressApi.fulfilled.match(resultAction)) {
      toast.success("✅ Default address updated!");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-green-600" /> Saved Addresses
        </h2>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold text-sm shadow-md"
          >
            <Plus size={18} /> Add Address
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-md mb-8 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            {editingAddressId ? "Edit Address" : "New Shipping Address"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Address Name (e.g. Home, Office) *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Home, Office, Work"
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Number *</label>
              <input
                type="text"
                value={mobilenumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit number"
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Street Address (Line 1) *</label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Flat/House no., Building, Apartment, Street"
              className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Street Address (Line 2)</label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Area, Sector, Landmark (optional)"
              className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">State *</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State"
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Postal Code (Pincode) *</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="6-digit pincode"
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="defaultCheck"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded text-green-600 focus:ring-green-400"
            />
            <label htmlFor="defaultCheck" className="text-xs font-semibold text-gray-600 cursor-pointer">
              Set as Default Shipping Address
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 font-semibold shadow"
            >
              {editingAddressId ? "Save Changes" : "Save Address"}
            </button>
          </div>
        </form>
      )}

      {loading && addresses.length === 0 ? (
        <div className="space-y-4">
          <div className="h-28 bg-white border border-gray-100 rounded-3xl animate-pulse"></div>
          <div className="h-28 bg-white border border-gray-100 rounded-3xl animate-pulse"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white border border-gray-100 p-8 rounded-3xl text-center">
          <MapPin size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-semibold">No saved addresses found.</p>
          <button
            onClick={() => setFormOpen(true)}
            className="text-green-600 text-xs font-bold hover:underline mt-2"
          >
            Add your first address now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white border p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition relative ${
                addr.isDefault ? "border-green-300 ring-2 ring-green-100" : "border-gray-100"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-800 text-base flex items-center gap-1.5">
                    {addr.name}
                    {addr.isDefault && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                        <Check size={10} /> Default
                      </span>
                    )}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-gray-400 hover:text-blue-600 transition p-1"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-gray-400 hover:text-red-600 transition p-1"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500 space-y-0.5">
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-gray-700 font-medium mt-2">📞 {addr.mobilenumber}</p>
                </div>
              </div>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr)}
                  className="mt-4 text-[10px] font-bold text-green-600 border border-green-100 hover:bg-green-50 px-3 py-1.5 rounded-xl transition w-max"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
