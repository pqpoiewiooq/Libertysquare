<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="data.Event"%>
<%@ page import="java.util.List"%>
<% List<Event> eventList = dao.getHostedEventList(hostID); %>
<% if(eventList == null || eventList.isEmpty()) { %>
    <div class="host-no-event-container">아직 행사가 없습니다. 기대해주세요 👀</div>
<% } else { %>
    <div class="host-event-container">
        <% for(Event event : eventList) { %>
            <a class="host-event-item" href="<%= "/event/" + event.getID() %>">
                <div class="host-event-item-head">
                    <div class="host-event-item-img" style="<%="background: url(" + event.getCoverPath() + ") center center / cover no-repeat"%>"></div>

                    <div class="host-event-item-cover">
                        <div class="host-event-item-cover-inner">
                            <span class="host-event-item-cover-text">
                                <svg viewBox="0 0 640 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down">
                                    <path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
                                </svg>
                                <span><%= event.getParticipants() %></span><!-- 인원수 -->
                            </span>
                            <span class="host-event-item-cover-text price"><%= event.getHighestPriceString() %></span><!-- 가격 -->
                        </div>
                    </div>
                </div>
                <div class="host-event-item-body">
                    <div class="host-event-item-day"><%= DateUtil.simple(event.getDateTimeStart()) %></div>
                    <div class="host-event-item-title"><%= event.getTitle() %></div>
                    <span class="host-event-item-host"><%= host.getName() %></span>
                </div>
            </a>
        <% } %>
    </div>
<% } %>