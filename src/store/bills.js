import { supabase } from './index'
export const fetchBills = async () => {
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
      bank:bank_id (
        id,
        name
      ),
      branch:branch_id (
        id,
        branch_name
      )
    `).order('created_at', { ascending: false });

    if (error) {

        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }
    const formattedData = data.map((bill) => ({
        id: bill.bill_key,
        date: new Date(bill.date).toLocaleDateString('en-GB'), // Format date to DD/MM/YYYY
        address: bill.property_details,
        bank: bill.bank ? bill.bank.name : 'N/A',
        branch: bill.branch ? `${bill.branch.branch_name}` : 'N/A',
        value: bill.property_value,
        fee: bill.bill_amount,
        amountInWords: bill.amount_in_words,
        status: bill.status
    }));
    return { status: 'success', message: 'Bills fetched successfully', data: formattedData, statusCode: 200 };
};
export const insertBill = async (billData) => {
    const { data, error } = await supabase
        .from('bill')
        .insert([billData])
        .select(); // Optional: to return inserted row(s)

    if (error) {
        console.error('Error inserting bill:', error.message);
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }

    return { status: 'success', message: 'Bill inserted successfully', data: data, statusCode: 201 };
};
export const fetchBanks = async () => {
    const { data, error } = await supabase.from('bank').select(`id,name,created_at`)
    if (error) {
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }
    return { status: 'success', message: 'Banks fetched successfully', data: data, statusCode: 200 };
}
export const fetchBranchByBank = async (bankId) => {
    const { data, error } = await supabase
        .from('branch')
        .select('id, branch_name,created_at,bank_id') // add other fields as needed
        .eq('bank_id', bankId);

    if (error) {
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }
    const formattedData = data.map((branch) => ({
        id: branch.id,
        name: branch.branch_name,
        address: branch.address,
        bank_id: branch.bank_id,
        created_at: new Date(branch.created_at).toLocaleDateString('en-GB') // Format date to DD/MM/YYYY
    }));
    return { status: 'success', message: 'Branches fetched successfully', data: formattedData, statusCode: 200 };
}
export const updateBill = async (billId, updatedFields) => {
    const id = billId.toString();
    const { data, error } = await supabase
        .from('bill')
        .update(updatedFields)
        .eq('bill_key', id);

    if (error) {
        return { status: 'error', message: error.message, data: [], statusCode: error.code };
    }

    return { status: 'success', message: 'Bill updated successfully', data: data, statusCode: 200 }
};