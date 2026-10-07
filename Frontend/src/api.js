import * as live from "./liveApi";
import { DEMO_MODE, demo } from "./demo";

export async function fetchBooks(...args) { return DEMO_MODE ? demo.fetchBooks(...args) : live.fetchBooks(...args); }
export async function addBook(...args) { return DEMO_MODE ? demo.addBook(...args) : live.addBook(...args); }
export async function updateBook(...args) { return DEMO_MODE ? demo.updateBook(...args) : live.updateBook(...args); }
export async function deleteBook(...args) { return DEMO_MODE ? demo.deleteBook(...args) : live.deleteBook(...args); }
export async function signup(...args) { return DEMO_MODE ? demo.signup(...args) : live.signup(...args); }
export async function login(...args) { return DEMO_MODE ? demo.login(...args) : live.login(...args); }
export async function getUser(...args) { return DEMO_MODE ? demo.getUser(...args) : live.getUser(...args); }
export async function updateUser(...args) { return DEMO_MODE ? demo.updateUser(...args) : live.updateUser(...args); }
export async function borrowBook(...args) { return DEMO_MODE ? demo.borrowBook(...args) : live.borrowBook(...args); }
export async function returnBook(...args) { return DEMO_MODE ? demo.returnBook(...args) : live.returnBook(...args); }
export async function getMyBooks(...args) { return DEMO_MODE ? demo.getMyBooks(...args) : live.getMyBooks(...args); }
export async function getBorrowHistory(...args) { return DEMO_MODE ? demo.getBorrowHistory(...args) : live.getBorrowHistory(...args); }
export async function getWishlist(...args) { return DEMO_MODE ? demo.getWishlist(...args) : live.getWishlist(...args); }
export async function checkWishlisted(...args) { return DEMO_MODE ? demo.checkWishlisted(...args) : live.checkWishlisted(...args); }
export async function addToWishlist(...args) { return DEMO_MODE ? demo.addToWishlist(...args) : live.addToWishlist(...args); }
export async function removeFromWishlist(...args) { return DEMO_MODE ? demo.removeFromWishlist(...args) : live.removeFromWishlist(...args); }
