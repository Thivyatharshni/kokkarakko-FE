import { getMenuBySlug } from './menuService';

// Dashboard statistics API integration
// Combines real menu data with mock data for scans as DB models do not yet support scan tracking
export const getDashboardStats = async (slug) => {
  try {
    const menuRes = await getMenuBySlug(slug);
    
    let totalProducts = 0;
    let totalCategories = 0;

    if (menuRes.success) {
      totalProducts = menuRes.data.length;
      const categories = new Set(menuRes.data.map(item => item.category));
      totalCategories = categories.size;
    }

    // Mock API response for QR Scans
    // In a real scenario, this would come from a dedicated backend endpoint
    return {
      success: true,
      data: {
        totalProducts,
        totalCategories,
        dailyScans: 145, // Mock data
        weeklyScans: 840, // Mock data
      }
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return { success: false, message: error.message };
  }
};
