const AddressModel = require("../Models/AddressModel");

// 🔹 Get User Addresses
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await AddressModel.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ data: addresses });
  } catch (err) {
    console.error("Get Addresses Error:", err);
    res.status(500).json({ message: "Server error while fetching addresses" });
  }
};

// 🔹 Create Address
const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, mobilenumber, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    if (!name || !mobilenumber || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({ message: "Missing required shipping address fields" });
    }

    // If this address is set as default, unset other defaults
    if (isDefault) {
      await AddressModel.updateMany({ user: userId }, { isDefault: false });
    }

    // If this is the user's first address, make it default automatically
    const count = await AddressModel.countDocuments({ user: userId });
    const shouldBeDefault = count === 0 ? true : !!isDefault;

    const newAddress = new AddressModel({
      user: userId,
      name,
      mobilenumber,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: shouldBeDefault,
    });

    await newAddress.save();
    res.status(201).json({ message: "Address created successfully", data: newAddress });
  } catch (err) {
    console.error("Create Address Error:", err);
    res.status(500).json({ message: "Server error while creating address" });
  }
};

// 🔹 Update Address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { name, mobilenumber, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    const address = await AddressModel.findOne({ _id: addressId, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    // If set as default, unset other default addresses
    if (isDefault && !address.isDefault) {
      await AddressModel.updateMany({ user: userId }, { isDefault: false });
      address.isDefault = true;
    } else if (isDefault === false && address.isDefault) {
      // Check if there are other addresses to fall back to for default
      const another = await AddressModel.findOne({ user: userId, _id: { $ne: addressId } });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
      address.isDefault = false;
    }

    if (name) address.name = name;
    if (mobilenumber) address.mobilenumber = mobilenumber;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;

    await address.save();
    res.status(200).json({ message: "Address updated successfully", data: address });
  } catch (err) {
    console.error("Update Address Error:", err);
    res.status(500).json({ message: "Server error while updating address" });
  }
};

// 🔹 Delete Address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await AddressModel.findOne({ _id: addressId, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    const wasDefault = address.isDefault;
    await AddressModel.deleteOne({ _id: addressId });

    // If we deleted the default address, set another address as default
    if (wasDefault) {
      const another = await AddressModel.findOne({ user: userId });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete Address Error:", err);
    res.status(500).json({ message: "Server error while deleting address" });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
