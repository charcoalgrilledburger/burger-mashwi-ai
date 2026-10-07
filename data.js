
// data.js
// Charcoal-grilled burger — Restaurant data & menu

const RESTAURANT_DATA = {
  name: "Charcoal-grilled burger",
  arabicName: "برغر مشوي على الفحم",

  location: {
    english: "Al Arijha Al Wusta – Aisha bint Abi Bakr Street, Riyadh, Saudi Arabia",
    arabic: "العريجاء الوسطى – شارع عائشة بنت أبي بكر، الرياض، السعودية",
    mapsUrl: "https://maps.app.goo.gl/gMPyqkJzcxW1v5Hm7"
  },

  hours: "12:10 PM – 4:50 AM",

  whatsapp: {
    number: "+966594875938",
    url: "https://wa.me/966594875938"
  },

  languages: [
    "English",
    "العربية",
    "اردو",
    "Roman Urdu"
  ]
};


// Official menu — prices are in SAR
const MENU = [
  // BURGERS
  {
    id: "beef-cheese-burger",
    name: "Beef Cheese Burger",
    arabic: "برغر لحم بالجبن",
    category: "Burgers",
    price: 10
  },
  {
    id: "beef-cheese-burger-meal",
    name: "Beef Cheese Burger Meal",
    arabic: "وجبة برغر لحم بالجبن",
    category: "Burgers",
    price: 16
  },
  {
    id: "double-beef-cheese-burger",
    name: "Double Beef Cheese Burger",
    arabic: "برغر لحم بالجبن دبل",
    category: "Burgers",
    price: 14
  },
  {
    id: "double-beef-cheese-burger-meal",
    name: "Double Beef Cheese Burger Meal",
    arabic: "وجبة برغر لحم بالجبن دبل",
    category: "Burgers",
    price: 19
  },
  {
    id: "triple-beef-cheese-burger-meal",
    name: "Triple Beef Cheese Burger Meal",
    arabic: "وجبة برغر لحم بالجبن تربل",
    category: "Burgers",
    price: 24
  },

  {
    id: "chicken-cheese-burger",
    name: "Chicken Cheese Burger",
    arabic: "برغر دجاج بالجبن",
    category: "Burgers",
    price: 9
  },
  {
    id: "chicken-cheese-burger-meal",
    name: "Chicken Cheese Burger Meal",
    arabic: "وجبة برغر دجاج بالجبن",
    category: "Burgers",
    price: 15
  },
  {
    id: "double-chicken-cheese-burger",
    name: "Double Chicken Cheese Burger",
    arabic: "برغر دجاج بالجبن دبل",
    category: "Burgers",
    price: 13
  },
  {
    id: "double-chicken-cheese-burger-meal",
    name: "Double Chicken Cheese Burger Meal",
    arabic: "وجبة برغر دجاج بالجبن دبل",
    category: "Burgers",
    price: 18
  },
  {
    id: "triple-chicken-cheese-burger-meal",
    name: "Triple Chicken Cheese Burger Meal",
    arabic: "وجبة برغر دجاج بالجبن تربل",
    category: "Burgers",
    price: 24
  },

  {
    id: "fried-chicken-cheese-burger",
    name: "Fried Chicken Cheese Burger",
    arabic: "برغر دجاج مقرمش بالجبن",
    category: "Burgers",
    price: 8
  },
  {
    id: "zinger-cheese-burger",
    name: "Zinger Cheese Burger",
    arabic: "برغر زنجر بالجبن",
    category: "Burgers",
    price: 10
  },
  {
    id: "zinger-cheese-burger-meal",
    name: "Zinger Cheese Burger Meal",
    arabic: "وجبة برغر زنجر بالجبن",
    category: "Burgers",
    price: 16
  },
  {
    id: "double-zinger-cheese-burger-meal",
    name: "Double Zinger Cheese Burger Meal",
    arabic: "وجبة برغر زنجر بالجبن دبل",
    category: "Burgers",
    price: 20
  },

  // ROLLS / TORTILLA
  {
    id: "zinger-cheese-roll",
    name: "Zinger Cheese Roll",
    arabic: "رول زنجر بالجبن",
    category: "Rolls & Tortilla",
    price: 10
  },
  {
    id: "zinger-cheese-roll-meal",
    name: "Zinger Cheese Roll Meal",
    arabic: "وجبة رول زنجر بالجبن",
    category: "Rolls & Tortilla",
    price: 16
  },
  {
    id: "grilled-chicken-cheese-tortilla",
    name: "Grilled Chicken Cheese Tortilla",
    arabic: "تورتيلا دجاج مشوي بالجبن",
    category: "Rolls & Tortilla",
    price: 11
  },
  {
    id: "chicken-cheese-tortilla-meal",
    name: "Chicken Cheese Tortilla Meal",
    arabic: "وجبة تورتيلا دجاج بالجبن",
    category: "Rolls & Tortilla",
    price: 17
  },

  // SIDES
  {
    id: "small-regular-fries",
    name: "Small Regular Fries",
    arabic: "بطاطس عادية صغيرة",
    category: "Sides",
   
