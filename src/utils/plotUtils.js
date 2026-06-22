
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

import { mockPlots as initialMockPlots } from '../data/mockData';

const initializePlots = () => {
  const storedPlots = localStorage.getItem('terraVillaPlots');
  if (storedPlots) {
    return JSON.parse(storedPlots);
  }
  localStorage.setItem('terraVillaPlots', JSON.stringify(initialMockPlots));
  return initialMockPlots;
};

let currentPlots = initializePlots();

const savePlots = () => {
  localStorage.setItem('terraVillaPlots', JSON.stringify(currentPlots));
};

export const addNewPlot = (plotData) => {
  const newPlot = {
    ...plotData,
    id: 'plot-' + Date.now(),
    status: 'pending_verification',
    verification_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  currentPlots.unshift(newPlot);
  savePlots();
  return newPlot;
};

export const updatePlotStatus = (plotId, newStatus) => {
  const plotIndex = currentPlots.findIndex((plot) => plot.id === plotId);

  if (plotIndex === -1) {
    return null;
  }

  currentPlots[plotIndex] = {
    ...currentPlots[plotIndex],
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  savePlots();
  return currentPlots[plotIndex];
};

export const setVerificationStatus = (plotId, newVerificationStatus) => {
  const plotIndex = currentPlots.findIndex((plot) => plot.id === plotId);
  if (plotIndex === -1) return null;

  currentPlots[plotIndex] = {
    ...currentPlots[plotIndex],
    verification_status: newVerificationStatus,
    updated_at: new Date().toISOString(),
  };

  savePlots();
  return currentPlots[plotIndex];
};

export const getPlotById = (plotId) => {
  return currentPlots.find((plot) => plot.id === plotId);
};

export const getAllPlots = () => {
  return currentPlots;
};

export const deletePlot = (plotId) => {
  const prevLength = currentPlots.length;
  currentPlots = currentPlots.filter((p) => p.id !== plotId);
  const changed = currentPlots.length !== prevLength;
  if (changed) savePlots();
  return changed;
};

export const updatePlot = (plotId, updates) => {
  const idx = currentPlots.findIndex((p) => p.id === plotId);
  if (idx === -1) return null;

  currentPlots[idx] = {
    ...currentPlots[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  savePlots();
  return currentPlots[idx];

};
