import { create } from 'zustand';
import { supabase } from './index';
import { entryfields, downloadFields } from '../constants/bankData';

const useBillStore = create((set) => ({
    bills: [],
    banks: [],
    branches: [],
    loading: false,
    error: null,
    entryFields: entryfields,
    downloadFields: downloadFields,

    // Fetch all bills
    fetchBills: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from('bill')
            .select(`
        id,
        bill_key,
        date,
        property_details,
        property_value,
        bill_amount,
        amount_in_words,
        status,
        created_at,
        comments,
        bank:bank_id (
          id,
          name
        ),
        branch:branch_id (
          id,
          branch_name
        )
      `)
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        const formattedData = data.map((bill) => ({
            id: bill.bill_key,
            date: new Date(bill.date).toLocaleDateString('en-GB'),
            address: bill.property_details,
            bank: { "name": bill.bank?.name || 'N/A', "id": bill.bank?.id || '' },
            branch: { "name": bill.branch?.branch_name || 'N/A', "id": bill.branch?.id || '' },
            value: bill.property_value,
            fee: bill.bill_amount,
            status: bill.status,
            comments: bill.comments
        }));

        set({ bills: formattedData, loading: false });
        return { status: 'success', message: 'Bills fetched successfully', data: formattedData, statusCode: 200 };
    },

    // Insert new bill
    insertBill: async (billData) => {
        const { data, error } = await supabase
            .from('bill')
            .insert([billData])
            .select();

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        // Optionally refresh the bill list
        await useBillStore.getState().fetchBills();

        return { status: 'success', message: 'Bill inserted successfully', data: data, statusCode: 201 };
    },

    // Update bill
    updateBill: async (billId, updatedFields) => {
        const id = billId.toString();
        const { data, error } = await supabase
            .from('bill')
            .update(updatedFields)
            .eq('bill_key', id);

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        await useBillStore.getState().fetchBills();

        return { status: 'success', message: 'Bill updated successfully', data, statusCode: 200 };
    },

    // Fetch all banks
    fetchBanks: async () => {
        const { data, error } = await supabase.from('bank').select(`id, name, created_at`);
        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        const state = useBillStore.getState();
        // update entryFields with bank options from the data

        const updatedEntryFields = state.entryFields.map((field) => {
            if (field.name === 'bank') {
                return {
                    ...field,
                    options: data.map((bank) => ({ id: bank.id, name: bank.name }))
                };
            }
            return field;
        }
        );
        // update downloadFields with bank options from the data
        const updatedDownloadFields = state.downloadFields.map((field) => {
            if (field.name === 'bank') {
                return {
                    ...field,
                    options: data.map((bank) => ({ id: bank.id, name: bank.name }))
                };
            }
            return field;
        });
        set({ banks: data, entryFields: updatedEntryFields, downloadFields: updatedDownloadFields, error: null });
        return { status: 'success', message: 'Banks fetched successfully', data, statusCode: 200 };
    },

    // Fetch branches for a specific bank
    fetchBranchByBank: async (bankId) => {
        const { data, error } = await supabase
            .from('branch')
            .select('id, branch_name, created_at, bank_id')
            .eq('bank_id', bankId);

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        const formattedData = data.map((branch) => ({
            id: branch.id,
            name: branch.branch_name,
        }));

        set({ branches: formattedData });
        return { status: 'success', message: 'Branches fetched successfully', data: formattedData, statusCode: 200 };
    },

    insertBank: async (bankName) => {
        const { data, error } = await supabase
            .from('bank')
            .insert([{ name: bankName }])
            .select();

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        // Optionally refresh the bank list
        await useBillStore.getState().fetchBanks();

        return { status: 'success', message: 'Bank inserted successfully', data: data, statusCode: 201 };
    },
    insertBranch: async (branch_name, bank_id) => {
        const { data, error } = await supabase
            .from('branch')
            .insert([{ branch_name: branch_name, bank_id: bank_id }])
            .select();

        if (error) {
            set({ error: error.message });
            return { status: 'error', message: error.message, data: [], statusCode: error.code };
        }

        // Optionally refresh the branch list
        return { status: 'success', message: 'Branch inserted successfully', data: data, statusCode: 201 };
    }
}));

export default useBillStore;