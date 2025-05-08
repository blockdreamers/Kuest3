// src/components/nimda/ProjectOverview.tsx
import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

interface ProjectInfo {
  id: string;
  name: string | null;
  name_ko: string | null;
  symbol: string | null;
  logo: string | null;
  price: number | null;
  price_change: number | null;
  market_cap: number | null;
  volume: number | null;
  slug: string | null;
  updated_at: string | null;
}

const ProjectOverview = () => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_info')
        .select(`
          id, name, name_ko, symbol, logo, price, price_change,
          market_cap, volume, slug, updated_at
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ 프로젝트 불러오기 실패:', error.message);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-[#121212] text-white rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">프로젝트 현황</h2>

      {loading ? (
        <div className="text-gray-400">불러오는 중...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-700">
                <th className="p-2">로고</th>
                <th className="p-2">한글명</th>
                <th className="p-2">영문명</th>
                <th className="p-2">심볼</th>
                <th className="p-2">가격</th>
                <th className="p-2">변동</th>
                <th className="p-2">시총</th>
                <th className="p-2">거래량</th>
                <th className="p-2">Slug</th>
                <th className="p-2">업데이트</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-gray-700 hover:bg-[#1e1e1e]">
                  <td className="p-2">
                    {project.logo ? (
                      <img src={project.logo} alt={project.symbol ?? ''} className="w-6 h-6" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-2">{project.name_ko || '-'}</td>
                  <td className="p-2">{project.name || '-'}</td>
                  <td className="p-2">{project.symbol || '-'}</td>
                  <td className="p-2">{project.price?.toLocaleString() ?? '-'}</td>
                  <td className="p-2">{project.price_change?.toFixed(2) ?? '-'}%</td>
                  <td className="p-2">{project.market_cap?.toLocaleString() ?? '-'}</td>
                  <td className="p-2">{project.volume?.toLocaleString() ?? '-'}</td>
                  <td className="p-2">{project.slug}</td>
                  <td className="p-2 text-xs text-gray-400">
                    {project.updated_at ? new Date(project.updated_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectOverview;
