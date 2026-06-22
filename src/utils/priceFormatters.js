export const formatPriceInLakhs = (price) => {
 HEAD
    const lakhs = price / 100000;
    return lakhs.toFixed(2);
};
export const formatPriceDisplay = (price) => {
    const lakhs = price / 100000;
    if (lakhs >= 100) {
        const crores = lakhs / 100;
        return `₹${crores.toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} L`;
};
export const parseLakhsToRupees = (lakhs) => {
    return lakhs * 100000;

  const lakhs = price / 100000;
  return lakhs.toFixed(2);
};

export const formatPriceDisplay = (price) => {
  const lakhs = price / 100000;
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${crores.toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(2)} L`;
};

export const parseLakhsToRupees = (lakhs) => {
  return lakhs * 100000;

};
