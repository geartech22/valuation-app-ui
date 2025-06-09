import { supabase } from './index';
export const fetchValuations = async () => {
    const { data, error } = await supabase
        .from('valuations')
        .select(`
            id,
            valuation_key,
            address,
            bank:bank_id (
                id,
                name
            ),
            branch:branch_id (
                id,
                branch_name
            ),
            valuation_contact:valuation_contact_id (
                id,
                name
            ),
            site_investigator:site_investigator_id (
                id,
                name
            ),
            documented_by:documented_by_id (
                id,
                name
            ),
            status,
            comments,
            created_at
        `).order('created_at', { ascending: false });

    if (error) {
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }

    const formattedData = data.map((valuation) => ({
        id: valuation.valuation_key,
        address: valuation.address,
        bank: valuation.bank ? valuation.bank.name : 'N/A',
        branch: valuation.branch ? `${valuation.branch.branch_name}` : 'N/A',
        valuation_contact: valuation.valuation_contact ? valuation.valuation_contact.name : 'N/A',
        site_investigator: valuation.site_investigator ? valuation.site_investigator.name : 'N/A',
        documented_by: valuation.documented_by ? valuation.documented_by.name : 'N/A',
        status: valuation.status,
        comments: valuation.comments,
        created_at: new Date(valuation.created_at).toLocaleDateString('en-GB') // Format date to DD/MM/YYYY
    }));

    return { status: 'success', message: 'Valuations fetched successfully', data: formattedData, statusCode: 200 };
}
export const insertValuation = async (valuationData) => {
    const { data, error } = await supabase
        .from('valuation')
        .insert([valuationData])
        .select(); // Optional: to return inserted row(s)

    if (error) {
        console.error('Error inserting valuation:', error.message);
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }

    return { status: 'success', message: 'Valuation inserted successfully', data: data, statusCode: 201 };
};
export const updateValuation = async (valuationData) => {
    const { data, error } = await supabase
        .from('valuation')
        .update(valuationData)
        .eq('valuation_key', valuationData.valuation_key)
        .select(); // Optional: to return updated row(s)

    if (error) {
        console.error('Error updating valuation:', error.message);
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }

    return { status: 'success', message: 'Valuation updated successfully', data: data, statusCode: 200 };
};
export const fetchPeople = async () => {
    const { data, error } = await supabase
        .from('people')
        .select(`
            id,
            name,
            role
        `);

    if (error) {
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }

    return { status: 'success', message: 'People fetched successfully', data: data, statusCode: 200 };
}