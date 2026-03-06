import { Product } from '../types';
import { products as localProducts } from '../data/products';

export const stripHtml = (html: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
};

const mapCategory = (categories: any[]): 'bait' | 'tackle' | 'bundle' | 'ebook' | 'rod' | undefined => {
    if (!categories || categories.length === 0) return undefined;

    const categoryNames = categories.map(c => c.name.toLowerCase());

    if (categoryNames.some(n => n.includes('bait'))) return 'bait';
    if (categoryNames.some(n => n.includes('rod'))) return 'rod';
    if (categoryNames.some(n => n.includes('tackle') || n.includes('lure') || n.includes('rig'))) return 'tackle';
    if (categoryNames.some(n => n.includes('bundle') || n.includes('kit'))) return 'bundle';
    if (categoryNames.some(n => n.includes('ebook') || n.includes('e-book') || n.includes('guide'))) return 'ebook';

    return undefined; // Default or fallback
};

const findLocalProduct = (wpName: string): Product | undefined => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedWpName = normalize(wpName);

    return localProducts.find(p => {
        const normalizedLocalName = normalize(p.name);
        return normalizedLocalName === normalizedWpName ||
            normalizedLocalName.includes(normalizedWpName) ||
            normalizedWpName.includes(normalizedLocalName);
    });
};

export const mapWooProductToAppProduct = (wpProduct: any): Product => {
    const localProduct = findLocalProduct(wpProduct.name);

    // Prefer local data for description/items/specs if available
    const description = localProduct?.description || stripHtml(wpProduct.description);
    const subtitle = localProduct?.subtitle || (wpProduct.short_description ? stripHtml(wpProduct.short_description) : undefined);
    const items = localProduct?.items;
    const tag = localProduct?.tag;
    const specs = localProduct?.specs || (wpProduct.attributes && wpProduct.attributes.length > 0
        ? wpProduct.attributes.map((attr: any) => `${attr.name}: ${attr.options.join(', ')}`).join(' / ')
        : '');
    const categoryId = localProduct?.categoryId || mapCategory(wpProduct.categories);
    const detailedSpecs = localProduct?.detailedSpecs;
    const isFinalChance = localProduct?.isFinalChance || wpProduct.categories.some((c: any) =>
        c.name.toLowerCase().includes('final chance') ||
        c.name.toLowerCase().includes('clearance')
    );

    return {
        id: String(wpProduct.id), // Keep WP ID for cart/logic potentially
        name: wpProduct.name, // Keep WP name for consistency with backend
        description,
        price: parseFloat(wpProduct.price || "0"),
        image: wpProduct.images && wpProduct.images.length > 0 ? wpProduct.images[0].src : '',
        specs,
        categoryId,
        subtitle,
        tag,
        isFinalChance,
        items,
        detailedSpecs,
        images: wpProduct.images?.map((img: any) => img.src) || []
    };
};
