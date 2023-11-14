import React, { useEffect, useRef } from "react";
import { Breadcrumb, Button, Space, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";

import navigateTo from "@/components/router/navigateTo";
import routeWithUserSession from "@/components/router/routeWithUserSession";
import Link from "@/components/general/Link";
// import PageHeader from "@/components/general/PageHeader";
import Paginator from "@/components/general/Paginator";
import DynamicComponent from "@/components/general/DynamicComponent";
import { QueryTagsControl } from "@/components/tags/TagsControl";
import SchedulePhrase from "@/components/queries/SchedulePhrase";

import { wrap as itemsList, ControllerType } from "@/components/items-list/ItemsList";
import useItemsListExtraActions from "@/components/items-list/hooks/useItemsListExtraActions";
import { ResourceItemsSource } from "@/components/items-list/classes/ItemsSource";
import { UrlStateStorage } from "@/components/items-list/classes/StateStorage";

// import * as Sidebar from "@/components/items-list/components/Sidebar";
import ItemsTable, { Columns } from "@/components/items-list/components/ItemsTable";

// import Layout from "@/components/layouts/ContentWithSidebar";

import { Query } from "@/services/query";
// import { currentUser } from "@/services/auth";
import location from "@/services/location";
import routes from "@/services/routes";

import QueriesListEmptyState from "./QueriesListEmptyState";

const { Paragraph } = Typography;

const tabsItems: TabsProps["items"] = [
  // {
  //   key: "favorites",
  //   label: "Favorites",
  //   children: "Content of Tab Pane 1",
  // },
  {
    key: "my",
    label: "My queries",
    children: null,
  },
  {
    key: "all",
    label: "All queries",
    children: null,
  },
  {
    key: "archive",
    label: "Archived",
    children: null,
  },
];

const onTabChange = (key: string) => {
  navigateTo(
    (key === "my") ? "/queries" : `/queries/${key}`
  );
}

const listColumns = [
  // Columns.favorites({ className: "p-r-0" }),

  Columns.custom.sortable((text, item) => (
    <Link href={`/queries/${item.id}/source`}>
      {item.name}
    </Link>
  ), {
    title: "Name",
    field: "name",
    width: null,
  }),

  Columns.custom((text, item) => item.user.name, {
    title: "Created By",
    // width: "1%"
  }),

  Columns.dateTime.sortable(
    { title: "Updated At",
    field: "updated_at",
    // width: "1%"
  }),

  // Columns.dateTime.sortable({
  //   title: "Last Executed At",
  //   field: "retrieved_at",
  //   orderByField: "executed_at",
  //   // width: "1%",
  // }),

  Columns.custom((text, item) => (
    <QueryTagsControl
      tags={item.tags}
      isDraft={item.is_draft}
      isArchived={item.is_archived}
    />
  ), {
    title: "Tags",
    // width: "1%"
  }),

  Columns.custom.sortable((text, item) => (
    <SchedulePhrase
      schedule={item.schedule}
      isNew={item.isNew()}
    />
  ), {
    title: "Refresh",
    field: "schedule",
    // width: "1%",
  }),
];

function QueriesListExtraActions(props) {
  return <DynamicComponent name="QueriesList.Actions" {...props} />;
}

function QueriesList({ controller }) {
  const controllerRef = useRef();
  controllerRef.current = controller;

  useEffect(() => {
    const unlistenLocationChanges = location.listen((unused, action) => {
      const searchTerm = location.search.q || "";
      if (action === "PUSH" && searchTerm !== controllerRef.current.searchTerm) {
        controllerRef.current.updateSearch(searchTerm);
      }
    });

    return () => {
      unlistenLocationChanges();
    };
  }, []);

  const {
    areExtraActionsAvailable,
    listColumns: tableColumns,
    Component: ExtraActionsComponent,
    selectedItems,
  } = useItemsListExtraActions(
    controller, listColumns, QueriesListExtraActions
  );

  return (
    <Space direction="vertical">
        {/* <PageHeader
          title={controller.params.pageTitle}
          actions={
            currentUser.hasPermission("create_query") ? (
              <Link.Button type="primary" href="queries/new">
                <i className="fa fa-plus m-r-5" aria-hidden="true" />
                New Query
              </Link.Button>
            ) : null
          }
        /> */}

        <Breadcrumb
          items={[
            {
              title: "Home",
              href: "/",
            },
            // {
            //   title: "Queries",
            //   href: "/queries",
            // },
            {
              title: controller.params.pageTitle,
            }
          ]}
        />

        <Paragraph>
          Queries are written in ClickHouse SQL and are used to generate
          reports and dynamics widgets.
        </Paragraph>

        <div>
          <Tabs items={tabsItems} onChange={onTabChange}
            type="card" animated={false}
            activeKey={controller.params.currentPage}
          />

          <Space direction="vertical" style={{
            backgroundColor: "#ffffff",
            display: "flex",
            padding: "1rem",
          }}>

          {
            (controller.params.currentPage != "archive") && (
              <Space>
                <Button
                  type="default"
                  // disabled={!allowCreation}
                  onClick={() => navigateTo("queries/new")}
                  >
                    Create new query
                </Button>
              </Space>
            )
          }

          {controller.isLoaded && controller.isEmpty ? (
            <QueriesListEmptyState
              page={controller.params.currentPage}
              searchTerm={controller.searchTerm}
              selectedTags={controller.selectedTags}
            />
          ) : (
            <React.Fragment>
              <ItemsTable
                items={controller.pageItems}
                loading={!controller.isLoaded}
                columns={tableColumns}
                orderByField={controller.orderByField}
                orderByReverse={controller.orderByReverse}
                toggleSorting={controller.toggleSorting}
                bordered={false}
              />
              <Paginator
                showPageSizeSelect
                totalCount={controller.totalItemsCount}
                pageSize={controller.itemsPerPage}
                onPageSizeChange={itemsPerPage => controller.updatePagination({ itemsPerPage })}
                page={controller.page}
                onChange={page => controller.updatePagination({ page })}
              />
            </React.Fragment>
          )}
          </Space>
        </div>

        {/* <Layout>
          <Layout.Sidebar>
            <Sidebar.SearchInput
              placeholder="Search Queries..."
              label="Search queries"
              value={controller.searchTerm}
              onChange={controller.updateSearch}
            />
            <Sidebar.Menu
              items={sidebarMenu}
              selected={controller.params.currentPage}
            />
            <Sidebar.Tags
              url="api/queries/tags"
              onChange={controller.updateSelectedTags}
              showUnselectAll
            />
          </Layout.Sidebar>
        </Layout> */}
    </Space>
  );
}

QueriesList.propTypes = {
  controller: ControllerType.isRequired,
};

const QueriesListPage = itemsList(
  QueriesList,
  () =>
    new ResourceItemsSource({
      getResource({ params: { currentPage } }) {
        return {
          all: Query.query.bind(Query),
          my: Query.myQueries.bind(Query),
          favorites: Query.favorites.bind(Query),
          archive: Query.archive.bind(Query),
        }[currentPage];
      },
      getItemProcessor() {
        return item => new Query(item);
      },
    }),
  () => new UrlStateStorage({ orderByField: "created_at", orderByReverse: true })
);

routes.register(
  "Queries.My",
  routeWithUserSession({
    path: "/queries",
    title: "My queries",
    render: pageProps => <QueriesListPage {...pageProps} currentPage="my" />,
  })
);

routes.register(
  "Queries.List",
  routeWithUserSession({
    path: "/queries/all",
    title: "All queries",
    render: pageProps => <QueriesListPage {...pageProps} currentPage="all" />,
  })
);

routes.register(
  "Queries.Favorites",
  routeWithUserSession({
    path: "/queries/favorites",
    title: "Favorite queries",
    render: pageProps => <QueriesListPage {...pageProps} currentPage="favorites" />,
  })
);

routes.register(
  "Queries.Archived",
  routeWithUserSession({
    path: "/queries/archive",
    title: "Archived queries",
    render: pageProps => <QueriesListPage {...pageProps} currentPage="archive" />,
  })
);
