const Case = require( '../model/case-product' );
const { validationResult } = require( 'express-validator/check' );

const hapusFile = require( '../middleware/removeImgFile' );

const cloudinary = require( 'cloudinary' );

exports.getAddProduct = ( req, res, next ) => {
  res.render( 'admin/add', {
    editing: false,
    isMasuk: req.session.isMasuk,
    errorMsg: null,
    oldInput: {
      nama: '',
      harga: '',
      imageUrl: ''
    },
    mistake: false
  } );
};

exports.getEditProduct = async ( req, res, next ) => {
  const editing = req.query.editing;
  if ( !editing ) {
    res.redirect( '/' );
  }
  const productId = req.params.productId;
  try {
    const product = await Case.findById( productId );
    if ( !product ) {
      res.redirect( '/' );
    }
    res.render( 'admin/add', {
      produk: product,
      editing: true,
      isMasuk: req.session.isMasuk,
      errorMsg: null,
      oldInput: {
        nama: '',
        harga: '',
        imageUrl: ''
      },
      mistake: false
    } );
  } catch ( err ) {
    const error = new Error( err );
    error.statusCode = 500;
    return next( error );
  }
};

exports.getAdminProduct = async ( req, res, next ) => {
  const produk = await Case.find( { userId: req.session.user } );
  res.render( 'admin/adminProduct', {
    casing: produk,
    isMasuk: req.session.isMasuk
  } );
};

exports.postAddProduct = async ( req, res, next ) => {
  try {
    const nama = req.body.nama;
    const harga = req.body.harga;
    const image = await cloudinary.v2.uploader.upload( req.file.path );
    const imageId = image.public_id;
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
      return res.status( 422 ).render( 'admin/add', {
        editing: false,
        isMasuk: req.session.isMasuk,
        errorMsg: errors.array()[ 0 ].msg,
        oldInput: {
          nama: nama,
          harga: harga,
          imageUrl: imageUrl
        },

        mistake: false
      } );
    }

    const product = new Case( {
      product: nama,
      imageUrl: image.secure_url,
      imageId: imageId,
      harga: harga,
      userId: req.session.user
    } );

    await product.save();
    res.redirect( '/' );
  } catch ( err ) {
    const error = new Error( err );
    error.statusCode = 500;
    return next( error );
  }
};

exports.postEditProduct = ( req, res, next ) => {
  const productId = req.body.productId;
  const updateNama = req.body.nama;
  const updateHarga = req.body.harga;
  const errors = validationResult( req );
  if ( !errors.isEmpty() ) {
    return res.status( 422 ).render( 'admin/add', {
      editing: true,
      isMasuk: req.session.isMasuk,
      errorMsg: errors.array()[ 0 ].msg,
      produk: {
        nama: updateNama,
        harga: updateHarga,
        imageUrl: updateImageUrl,
        _id: productId
      },

      mistake: true
    } );
  }
  Case.findById( productId, async ( err, casing ) => {
    if ( err ) {
      const error = new Error( err );
      error.statusCode = 500;
      return next( error );
    }
    if ( req.file ) {
      try {
        await cloudinary.v2.uploader.destroy( casing.imageId );
        const updateImageUrl = await cloudinary.v2.uploader.upload(
          req.file.path
        );

        casing.imageUrl = updateImageUrl.secure_url;
        casing.imageId = updateImageUrl.public_id;
      } catch ( err ) {
        const error = new Error( err );
        error.statusCode = 500;
        return next( error );
      }
    }
    casing.product = updateNama;
    casing.harga = updateHarga;
    casing.save();
    res.redirect( '/admin/product' );
  } ).catch( err => {
    const error = new Error( err );
    error.statusCode = 500;
    return next( error );
  } );
};

exports.postDelete = async ( req, res, next ) => {
  const prodId = req.params.prodId;
  try {
    const product = await Case.findById( prodId );
    await cloudinary.v2.uploader.destroy( product.imageId );
    await Case.findByIdAndRemove( prodId );
  } catch ( err ) {
    const error = new Error( err );
    error.statusCode = 500;
    return next( error );
  }
  res.redirect( '/admin/product' );
};
