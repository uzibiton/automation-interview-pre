import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_SERVICE_URL = getApiServiceUrl();

interface ExpensePieChartProps {
  token: string;
  refreshKey: number;
}

interface Category {
  id: number;
  nameEn: string;
  nameHe: string;
  color: string;
}

interface StatsData {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: {
    categoryId: number;
    categoryName: string;
    total: string;
    count: string;
  }[];
}

function ExpensePieChart({ token, refreshKey }: ExpensePieChartProps) {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, statsRes] = await Promise.all([
        axios.get(`${API_SERVICE_URL}/expenses/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_SERVICE_URL}/expenses/stats?period=month`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      const statsData = statsRes.data || {};
      setStats({
        total: statsData.total || 0,
        totalAmount: statsData.totalAmount || statsData.total || 0,
        count: statsData.count || 0,
        byCategory: Array.isArray(statsData.byCategory) ? statsData.byCategory : [],
      });
    } catch (error) {
      console.error('Failed to fetch chart data', error);
      setCategories([]);
      setStats({ total: 0, totalAmount: 0, count: 0, byCategory: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{t('stats.title')}...</div>;
  }

  if (!stats || stats.byCategory.length === 0) {
    return (
      <div className="chart-container">
        <h3>{t('stats.byCategory')}</h3>
        <p>{t('expenses.noExpenses')}</p>
      </div>
    );
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return 'Unknown';
    return i18n.language === 'he' ? category.nameHe : category.nameEn;
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#999';
  };

  const chartData = {
    labels: stats.byCategory.map((item) => getCategoryName(item.categoryId)),
    datasets: [
      {
        label: t('expenses.amount'),
        data: stats.byCategory.map((item) => parseFloat(item.total)),
        backgroundColor: stats.byCategory.map((item) => getCategoryColor(item.categoryId)),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        rtl: i18n.language === 'he',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = stats.totalAmount;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h3>{t('stats.byCategory')}</h3>
      <Pie data={chartData} options={chartOptions} />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <strong>
          {t('stats.total')}: ${stats.totalAmount?.toFixed(2) || '0.00'}
        </strong>
        <br />
        <span>
          {stats.count} {t('nav.expenses')}
        </span>
      </div>
    </div>
  );
}

export default ExpensePieChart;
