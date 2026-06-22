import { insforge } from '../lib/insforge';

// Function to fetch all plots
export const getAllPlots = async () => {
    try {
        const { data, error } = await insforge.database
            .from('plots')
            .select('*');
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching plots:', error);
        return [];
    }
};

// Function to get a plot by ID
export const getPlotById = async (plotId) => {
    try {
        const { data, error } = await insforge.database
            .from('plots')
            .select('*')
            .eq('id', plotId)
            .maybeSingle();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error fetching plot ${plotId}:`, error);
        return null;
    }
};

// Function to add a new plot (passing as array according to InsForge insert specifications)
export const addNewPlot = async (plotData) => {
    try {
        const { data, error } = await insforge.database
            .from('plots')
            .insert([{
                ...plotData,
                status: 'pending_verification',
                verification_status: 'pending'
            }])
            .select();
        if (error) throw error;
        return data?.[0];
    } catch (error) {
        console.error('Error creating plot:', error);
        throw error;
    }
};

export const updatePlotStatus = async (plotId, newStatus) => {
    try {
        const { data, error } = await insforge.database
            .from('plots')
            .update({ status: newStatus })
            .eq('id', plotId)
            .select();
        if (error) throw error;
        return data?.[0];
    } catch (error) {
        console.error('Error updating plot status:', error);
        throw error;
    }
};

export const setVerificationStatus = async (plotId, newVerificationStatus) => {
    try {
        const { data, error } = await insforge.database
            .from('plots')
            .update({ verification_status: newVerificationStatus })
            .eq('id', plotId)
            .select();
        if (error) throw error;
        return data?.[0];
    } catch (error) {
        console.error('Error setting verification status:', error);
        throw error;
    }
};

export const deletePlot = async (plotId) => {
    try {
        const { error } = await insforge.database
            .from('plots')
            .delete()
            .eq('id', plotId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting plot:', error);
        throw error;
    }
};

export const updatePlot = async (plotId, updates) => {
    try {
        const { data, error } = await insforge.database
            .from('plots')
            .update(updates)
            .eq('id', plotId)
            .select();
        if (error) throw error;
        return data?.[0];
    } catch (error) {
        console.error('Error updating plot:', error);
        throw error;
    }
};
