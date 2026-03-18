import {Layout, Menu} from "antd";
import {Content, Footer, Header} from "antd/es/layout/layout";
import type {ItemType, MenuItemType} from "antd/es/menu/interface";
import {Outlet} from "react-router";
import railwayLogo from "../../../assets/images/railway-logo.svg";
import classes from './layout.module.scss'

const items: ItemType<MenuItemType>[] = [
    {
        key: 'mobileApp',
        label: 'Mobile App'
    },
    {
        key: 'faqs',
        label: 'FAQs'
    },
    {
        key: 'contact',
        label: 'Contact'
    },
    {
        key: 'signUp',
        label: 'Sign Up'
    }
]

function MainLayout() {
    return (
        <Layout style={{ minHeight: '100dvh' }}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <a href="/">
                    <img style={{ height: '40px' }} src={railwayLogo} alt="Railway Logo"/>
                </a>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ minWidth: 0 }}
                />
            </Header>
            <Content className={classes.content}>
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                    }}
                >
                    <Outlet />
                </div>
            </Content>

            <Footer className={classes.footer}>
                <div className={classes.footerInner}>
                    <div className={classes.brand}>
                        <img style={{ height: '51px'}} src={railwayLogo} alt="Railway Logo"/>
                    </div>
                    <div className={classes.columns}>
                        <div className={classes.column}>
                            <div className={classes.columnTitle}>About</div>
                            <div className={classes.columnsLink}>
                                <a className={classes.link} href="#">How it works</a>
                                <a className={classes.link} href="#">Featured</a>
                                <a className={classes.link} href="#">Partnership</a>
                                <a className={classes.link} href="#">Business Relation</a>
                            </div>
                        </div>
                        <div className={classes.column}>
                            <div className={classes.columnTitle}>Community</div>
                            <div className={classes.columnsLink}>
                                <a className={classes.link} href="#">Events</a>
                                <a className={classes.link} href="#">Blog</a>
                                <a className={classes.link} href="#">Podcast</a>
                                <a className={classes.link} href="#">Invite a friend</a>
                            </div>
                        </div>
                        <div className={classes.column}>
                            <div className={classes.columnTitle}>Socials</div>
                            <div className={classes.columnsLink}>
                                <a className={classes.link} href="#">Discord</a>
                                <a className={classes.link} href="#">Instagram</a>
                                <a className={classes.link} href="#">Twitter</a>
                                <a className={classes.link} href="#">Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.copy}>©2025 RailWay. All rights reserved</div>
            </Footer>
        </Layout>
    );
}

export default MainLayout;
