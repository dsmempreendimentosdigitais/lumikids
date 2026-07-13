const fs = require('fs');
const path = require('path');

async function testFlora() {
  try {
    // Carregar .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('.env.local não encontrado');
      return;
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const floraKeyMatch = envContent.match(/FLORA_AI_API_KEY=["']?([^"'\r\n]+)["']?/);
    if (!floraKeyMatch) {
      console.error('FLORA_AI_API_KEY não encontrada no .env.local');
      return;
    }
    const apiKey = floraKeyMatch[1];
    console.log('Chave Flora encontrada:', apiKey.substring(0, 10) + '...');

    // Importar Flora
    const FloraModule = require('@flora-ai/flora');
    // Se o default export for usado
    const Flora = FloraModule.default || FloraModule;

    console.log('Instanciando cliente Flora...');
    const client = new Flora({ apiKey });

    console.log('Listando workspaces...');
    const workspacesRes = await client.workspaces.list();
    console.log('Workspaces:', JSON.stringify(workspacesRes, null, 2));

    const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
    if (!workspaceId) {
      console.error('Nenhum workspace encontrado');
      return;
    }

    console.log('Listando projetos...');
    const projectsPage = await client.projects.list({ workspace_id: workspaceId });
    console.log('Projetos:', JSON.stringify(projectsPage, null, 2));

    const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
    let projectId = projectList[0]?.project_id;

    if (!projectId) {
      console.log('Criando novo projeto...');
      const newProj = await client.projects.create({
        name: 'LumiKids Test Project',
        workspace_id: workspaceId
      });
      projectId = newProj.project_id;
      console.log('Projeto criado:', projectId);
    } else {
      console.log('Projeto existente:', projectId);
    }

    console.log('Gerando imagem...');
    const generation = await client.generations.create({
      workspace_id: workspaceId,
      project_id: projectId,
      type: 'image',
      prompt: 'Cute 2D vector cartoon style of a child waving happily in front of a cozy house, children book illustration',
    });

    console.log('Geração iniciada:', JSON.stringify(generation, null, 2));
    const runId = generation.run_id || generation.id;
    console.log('Run ID:', runId);

    // Polling
    for (let attempt = 0; attempt < 30; attempt++) {
      console.log(`Polling status... tentativa ${attempt + 1}`);
      const result = await client.generations.retrieve(runId);
      console.log('Status atual:', result.status);

      if (result.status === 'completed' || result.status === 'succeeded') {
        const outputUrl = result.outputs?.[0]?.url || result.output_url;
        console.log('SUCESSO! URL da imagem:', outputUrl);
        return;
      }
      if (result.status === 'failed' || result.status === 'error') {
        console.error('Erro na geração:', result.error_message || result.error);
        return;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log('Timeout polling');
  } catch (err) {
    console.error('Erro no teste:', err);
  }
}

testFlora();
