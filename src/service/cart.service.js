class cartService {
  constructor(cartRepo) {
    this.cartRepo = cartRepo;
  }

  async addToCart(userId, productId, quantity) {
    //Tìm giỏ hàng
    let cart = await this.cartRepo.findCartByUserId(userId);
    let cartId;

    if (!cart) {
      //Chưa có thì tạo mới
      cartId = await this.cartRepo.createCart(userId);
    } else {
      cartId = cart.id;
    }

    //Check sản phẩm trong giỏ
    const existingItem = await this.cartRepo.findCartItem(cartId, productId);

    if (existingItem) {
      //Có rồi thì cộng dồn số lượng
      const newQty = existingItem.quantity + quantity;
      return await this.cartRepo.updateCartItemQuantity(
        cartId,
        productId,
        newQty,
      );
    } else {
      //Chưa có thì thêm mới
      return await this.cartRepo.addCartItem(cartId, productId, quantity);
    }
  }

  async getCartCount(userId) {
    return await this.cartRepo.getCartCount(userId);
  }

  //lấy giỏ hàng
  async getFullCart(userId) {
    return await this.cartRepo.getFullCart(userId);
  }

  async getCartLocal(cart) {
    if (!cart || cart.length === 0) return [];

    const productIds = cart.map((item) => item.id);

    const products = await this.cartRepo.getProductsByIds(productIds);
    const detailedCart = cart
      .map((cartItem) => {
        const productInfo = products.find((p) => p.id == cartItem.id);

        //lấy thành obj
        if (productInfo) {
          return {
            id: productInfo.id,
            name: productInfo.name,
            price: productInfo.price,
            img: productInfo.img,
            quantity: cartItem.quantity, // Lấy số lượng từ local ghép vô
          };
        }
        return null;
      })
      .filter((item) => item !== null);
    return detailedCart;
  }

  async updateCart(userId, id, quantity) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng");
    }

    return await this.cartRepo.updateCart(cart.id, id, quantity);
  }

  async removeFromCart(userId, productId) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng");
    }

    return await this.cartRepo.removeCartItem(cart.id, productId);
  }
}

module.exports = cartService;
