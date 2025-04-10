import { Layout, Typography } from 'antd';
import logo from '@/style/images/stratobuild-logo.svg';
import guy from '@/style/images/construction-guy.svg';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <img
          src={logo}
          alt="STRATOBUILD ERP"
          style={{ margin: '0 0 0 -350px', display: 'block' }}
          height={63}
          width={1000}
        />

        <Title level={1} style={{ fontSize: 28 }}>
          Smart construction, without limits
        </Title>
        <Text>
          Building Smarter, Achieving More, Streamline Your Workflow and Amplify Your Success with
          Strato Build
        </Text>
        <img src={guy} alt="Construction Guy" style={{ margin: '-30px 0px 0 -20px' }} />

        <div className="space20"></div>
      </div>
    </Content>
  );
}
