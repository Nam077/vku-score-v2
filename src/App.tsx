import { Layout, theme, Typography } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import AppHeader from './components/HeaderComponent.tsx';
import Score from './pages/score/Score.tsx';

function App() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <AppHeader />
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                }}
            >
                <Score></Score>
            </Content>
            <Footer>
                <Typography.Text type="secondary">Copyright © 2022</Typography.Text>
            </Footer>
        </Layout>
    );
}

export default App;
