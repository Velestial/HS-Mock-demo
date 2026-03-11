'use strict';
const router = require('express').Router();
const api = require('../woocommerce.cjs');

router.get('/products', async (req, res, next) => {
  try {
    const response = await api.get('products', { per_page: 100, status: 'publish' });
    const products = response.data.map(shapeProduct);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

function shapeProduct(wc) {
  return {
    id: String(wc.id),
    name: wc.name,
    description: wc.short_description || wc.description || '',
    price: parseFloat(wc.price) || 0,
    image: wc.images?.[0]?.src || '',
    images: wc.images?.map(img => img.src) || [],
    specs: wc.meta_data?.find(m => m.key === 'specs')?.value || '',
    categoryId: mapCategory(wc.categories),
    subtitle: wc.meta_data?.find(m => m.key === 'subtitle')?.value || undefined,
    tag: wc.tags?.[0]?.name || undefined,
    isFinalChance: wc.meta_data?.find(m => m.key === 'is_final_chance')?.value === 'yes',
  };
}

function mapCategory(categories) {
  if (!categories?.length) return 'other';
  const name = categories[0].slug?.toLowerCase() || '';
  if (name.includes('rod')) return 'rods';
  if (name.includes('bait')) return 'bait';
  if (name.includes('tackle')) return 'tackle';
  if (name.includes('bundle')) return 'bundles';
  if (name.includes('ebook') || name.includes('e-book')) return 'ebooks';
  return 'other';
}

module.exports = router;
