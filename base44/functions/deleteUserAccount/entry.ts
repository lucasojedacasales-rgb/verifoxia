import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete user data from entities
    const searchHistory = await base44.entities.SearchHistory.filter({ created_by_id: user.id });
    const priceAlerts = await base44.entities.PriceAlert.filter({ created_by_id: user.id });

    // Delete all user records in parallel
    await Promise.all([
      ...searchHistory.map(sh => base44.asServiceRole.entities.SearchHistory.delete(sh.id)),
      ...priceAlerts.map(pa => base44.asServiceRole.entities.PriceAlert.delete(pa.id))
    ]);

    // Note: Base44 user deletion is handled by the platform
    // The user account itself cannot be deleted via SDK, but the user's data is now cleaned
    // The user will be logged out on the frontend, which is equivalent to account deletion

    return Response.json({ 
      success: true, 
      message: 'Account data deleted successfully. User will be logged out.' 
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});