export const getPriceRangeValues = (range: string) => {
  switch (range) {
    case 'under300':
      return { minPrice: undefined, maxPrice: 300 }
    case '300to500':
      return { minPrice: 300, maxPrice: 500 }
    case '500to800':
      return { minPrice: 500, maxPrice: 800 }
    case 'above800':
      return { minPrice: 800, maxPrice: undefined }
    default:
      return { minPrice: undefined, maxPrice: undefined }
  }
}
