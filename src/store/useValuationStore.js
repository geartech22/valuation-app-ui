import { create } from 'zustand';
import { supabase } from './index';

const useValuationsStore = create((set) => ({
    valuations: [],
    people: [],
    loading: false,
    error: null,

    // Fetch valuations
    fetchValuations: async () => {
        set({ loading: true, error: null });

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
            `)
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        const formattedData = data.map((valuation) => ({
            id: valuation.valuation_key,
            address: valuation.address,
            bank: valuation.bank?.name || 'N/A',
            branch: valuation.branch?.branch_name || 'N/A',
            valuation_contact: valuation.valuation_contact?.name || 'N/A',
            site_investigator: valuation.site_investigator?.name || 'N/A',
            documented_by: valuation.documented_by?.name || 'N/A',
            status: valuation.status,
            comments: valuation.comments,
            created_at: new Date(valuation.created_at).toLocaleDateString('en-GB')
        }));

        set({ valuations: formattedData, loading: false });
        return { status: 'success', message: 'Valuations fetched successfully', data: formattedData, statusCode: 200 };
    },

    // Insert new valuation
    insertValuation: async (valuationData) => {
        const { data, error } = await supabase
            .from('valuation')
            .insert([valuationData])
            .select();

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        await useValuationsStore.getState().fetchValuations();
        return { status: 'success', message: 'Valuation inserted successfully', data, statusCode: 201 };
    },

    // Update existing valuation
    updateValuation: async (valuationKey, updatedFields) => {
        const { data, error } = await supabase
            .from('valuation')
            .update(updatedFields)
            .eq('valuation_key', valuationKey)
            .select();

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        await useValuationsStore.getState().fetchValuations();
        return { status: 'success', message: 'Valuation updated successfully', data, statusCode: 200 };
    },

    // Fetch people
    fetchPeople: async () => {
        const { data, error } = await supabase
            .from('people')
            .select('id, name, role');

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        set({ people: data });
        return { status: 'success', message: 'People fetched successfully', data, statusCode: 200 };
    }
}));

export default useValuationsStore;