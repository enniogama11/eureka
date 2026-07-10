// Configuração do Supabase para Eureka Lounge
const SUPABASE_URL = 'https://lkclwncxjsdbaxilgegk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrY2x3bmN4anNkYmF4aWxnZWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTAxMDYsImV4cCI6MjA5NzEyNjEwNn0.Ftrd6ZXv6KqQ1rSnsDFmL2cIZpKo5NEtfaZgxVCKxh8';

// Inicializar cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para buscar dados do Supabase
async function loadMenuFromSupabase() {
    try {
        // Buscar categorias
        const { data: categories, error: categoriesError } = await supabaseClient
            .from('categories')
            .select('*')
            .order('id');

        if (categoriesError) throw categoriesError;

        // Buscar produtos
        const { data: products, error: productsError } = await supabaseClient
            .from('products')
            .select('*')
            .eq('active', true)
            .order('id');

        if (productsError) throw productsError;

        return {
            categories: categories || [],
            products: products || []
        };
    } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
        return null;
    }
}

// Função para inserir um pedido
async function saveOrder(items, total) {
    try {
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert([
                {
                    total: total,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (orderError) throw orderError;

        // Inserir itens do pedido
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return order.id;
    } catch (error) {
        console.error('Erro ao guardar pedido:', error);
        return null;
    }
}
